#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod heos_structs;
pub mod search;
pub mod connection;
mod reply_service;

use std::collections::HashMap;
use tokio::task::JoinHandle;
use tokio::sync::{mpsc, Mutex};

use crate::{
    search::find_denon_devices,
    connection::{connect_to_device, disconnect_from_device, send_command}
};

#[derive(Default)]
pub struct ConnectedDevice {
    map: Mutex<HashMap<String, (JoinHandle<()>, mpsc::Sender<String>)>>,
    device_ip: Mutex<String>
}
#[tokio::main]
async fn main() {
    tauri::async_runtime::set(tokio::runtime::Handle::current());

    tauri::Builder::default()
        .manage(ConnectedDevice::default())
        .setup(|_app| {
            /*
                since state needs to be deserialized, we can only have primitive types

                let user search for devices and connect

                connect_to_ip is invoked with selected ip

                send command is a frontend wrapper that sends to backend send_cmd that forwards
                    it to a writer loop thread waiting for write requests
                    since tauri can't manage state with sinks/streams and channels

                dont have send_command invocation func, just write a emit function in frontend and listen here
            
                maybe have a whole wrapper thread for init connections

                that gets joined on disconnect

                connect_to_device is called which spawns a new task
                    spawns readers,writers,replyers loops
                    also must give a device_handle to allow for shutdown when user emits disconnect event
                    to connect to separate device

                maybe have state store set/hashmap of connected device ips
                then a disconnect from pass in their device ip from frontend to match here and disconnect
                    or call shutdown on the task
                
                potential issue: don't think we can deserialize task handle

                maybe have hashmap sit in binary before setup, don't even have state managed by tauri
            */

            // app.emit_all("event-name", Payload { message: "Tauri is awesome!".into() }).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            find_denon_devices,
            connect_to_device,
            disconnect_from_device,
            send_command
        ])
        .run(tauri::generate_context!())
        .expect("Failed to start app");

    /*
    /*
        Don't start event loops until we search and connect to a device first
    */
    let denon_devices = find_denon_devices().await;
    if denon_devices.len() < 1 {
        println!("No devices found! Exiting.");
        return;
    }

    for d in denon_devices.iter() {
        println!("{d}");
    }

    let ( mut c, read_h, reply_h ) = connect_to_ip(denon_devices[0].clone()).await.unwrap();

    c.send_command("player/get_players".to_string()).await.unwrap();

    let (_, _) = join!(read_h, reply_h);
    println!("Shutting down!");
    /*
        telnet.write(b"heos://player/get_players\r\n").unwrap();
        println!("Sent heos://player/get_players");
    */
    */
}