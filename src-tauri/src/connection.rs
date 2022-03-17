use futures::StreamExt;

use serde::Serialize;
use tauri::{State, Window};
use tokio::{net::{tcp::{OwnedWriteHalf, OwnedReadHalf}, TcpStream}, sync::{mpsc, oneshot}, io::AsyncWriteExt, join};
use tokio_util::codec::FramedRead;

use crate::{reply_service::{ReplyMsg, ReplyService}, ConnectedDevice};
use crate::heos_structs::HeosContainer;

pub async fn start_write_loop(mut writer: OwnedWriteHalf, reply_service_sender: mpsc::Sender<ReplyMsg>, mut writer_receiver: mpsc::Receiver<String>) {
    println!("Initializing stream writer loop!");
    
    while let Some(cmd) = writer_receiver.recv().await {
        let cmd_formatted = format!("heos://{}\r\n", cmd);

        let (map_tx, map_rx) : (oneshot::Sender<()>, oneshot::Receiver<()>) = oneshot::channel();

        reply_service_sender.send(ReplyMsg::MapMsg(cmd.clone(), map_tx)).await.unwrap();

        match map_rx.await {
            Ok(_) => {
                println!("send_command received success map msg for cmd: {}!", &cmd);
            },
            Err(e) => {
                eprintln!("send_command received failure map msg for cmd: {}; err={}", &cmd, e);
                panic!()
            }
        }

        match writer.write_all(cmd_formatted.as_bytes()).await {
            Ok(_) => {
                println!("Mapped and sent cmd: {}", &cmd);
            },
            Err(e) => {
                eprintln!("Error writing to telnet client, cmd={}, err={}", &cmd, e);
                panic!()
            }
        }
    }

    println!("Shutting down writer loop.");
}

pub async fn start_read_loop(rd: OwnedReadHalf,reply_service_sender: mpsc::Sender<ReplyMsg>) {
    println!("Initializing stream read loop!");

    let mut telnet = FramedRead::new(rd, tokio_util::codec::LinesCodec::new());
    /*
        read and parse valid JSON
            determine if its a repy or a event
            send them to reply service
                reply service will either map the reply and emit response to frontend
                OR
                emit event
    */
    while let Some(msg) = telnet.next().await {
        match msg {
            Ok(res) => {
                let parsed_json_res : HeosContainer = serde_json::from_str(res.as_str()).unwrap();

                if parsed_json_res.heos.command[..5].eq_ignore_ascii_case("event") {
                    println!("Parsed JSON event: {}", serde_json::to_string_pretty(&parsed_json_res).unwrap());
                    reply_service_sender.send(ReplyMsg::EventMsg(parsed_json_res)).await.unwrap();
                }
                else 
                {
                    println!("Parsed JSON reply: {}", serde_json::to_string_pretty(&parsed_json_res).unwrap());
                    reply_service_sender.send(ReplyMsg::MatchMsg(parsed_json_res)).await.unwrap();
                }
            },
            Err(e) => {
                eprintln!("Error reading frame from stream: {}", e);
                return;
            }
        }
    }

    println!("Shutting down read loop.");
}

#[derive(Serialize, Clone)]
pub struct Payload {
    cmd: String,
    response: String            
}
use local_ip_address::local_ip;
#[tauri::command]
pub async fn connect_to_device(device_ip: String, connected_device: State<'_, ConnectedDevice>, window: Window) -> Result<String, String> {
    let device_ip_clone = device_ip.clone();
    *connected_device.device_ip.lock().await = device_ip.clone();

    let (writer_tx, writer_rx) : (mpsc::Sender<String>, mpsc::Receiver<String>) = mpsc::channel(32);
    let writer_tx2 = writer_tx.clone();

    let device_handle = tokio::spawn( async move {
        match TcpStream::connect((device_ip.as_str(), 1255)).await {
            Ok(stream) => {
                println!("Connected to {}!", &device_ip);

                let ( rd, wr ) = stream.into_split();

                let (mut reply_service_handler, reply_service_sender) : (ReplyService, mpsc::Sender<ReplyMsg>) = ReplyService::new();
                let reply_sender2 = reply_service_sender.clone();

                let read_handle = tokio::spawn( async move {
                    start_read_loop(rd, reply_service_sender).await;
                });

                let wc = window.clone();
                let reply_handle = tokio::spawn( async move {
                    reply_service_handler.start_reply_service(&window).await;
                });
                                    
                let _ = wc.emit("reply", Payload {
                    cmd: "FUCK".to_string(),
                    response: "YOU".to_string()
                }).unwrap();

                let write_handle = tokio::spawn( async move {
                    start_write_loop(wr, reply_sender2, writer_rx).await;
                });

                let (_,_,_) = join!(read_handle, write_handle, reply_handle);
            },
            Err(e) => {
                eprintln!("Failed to connect to {}; err={:?}", &device_ip, e);
                panic!("Failed to connect!")
            }
        }
    });
    match connected_device.map.lock().await.insert(device_ip_clone, (device_handle, writer_tx2)) {
        _ => {
            println!("Set init state for connection and started all tasks!");
        }
    }

    Ok(local_ip().unwrap().to_string())
}

#[tauri::command]
pub async fn disconnect_from_device(connected_device: State<'_, ConnectedDevice>) -> Result<(), String> {
    let map = &mut *connected_device.map.lock().await;
    let device_ip = & *connected_device.device_ip.lock().await;

    match map.remove(&device_ip.to_string()) {
        Some((device_handle, _)) => {
            device_handle.abort();
            println!("Disconnected from {}", &device_ip);
            Ok(())
        },
        None => {
            println!("Connected device not found in state!");
            Err("Connected device not found in state!".to_string())
        }
    }
}

#[tauri::command]
pub async fn send_command(args: String, connected_device: State<'_, ConnectedDevice>) -> Result<(), String> {
    let cmd = args;
    let map = &mut *connected_device.map.lock().await;

    match map.get(& *connected_device.device_ip.lock().await) {
        Some((_, writer_sender)) => {
            println!("Sending cmd to reply service: {}", &cmd);
            writer_sender.send(cmd).await.unwrap();
            Ok(())
        },
        None => {
            println!("Device ip not found for sending commands!");
            Err("Failed to find the device ip to send a command to!".to_string())
        }
    }
}