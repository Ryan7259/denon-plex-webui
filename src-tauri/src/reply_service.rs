use std::collections::HashMap;
use tokio::sync::{mpsc, oneshot};
use tauri::Window;

use crate::heos_structs::{HeosContainer};

pub struct ReplyService {
    cmd_map: HashMap<String, Option<()>>,
    reply_service_receiver: mpsc::Receiver<ReplyMsg>
}

// if a cmd is the same, just return response once, means you have to rewrite frontend to map to cmd string instead of uuid
// match request with oneshot tx, map request with string to map
// send back Some()

#[derive(Debug)]
pub enum ReplyMsg {
    MapMsg(String, oneshot::Sender<()>),
    MatchMsg(HeosContainer),
    EventMsg(HeosContainer)
}

impl ReplyService {
    pub fn new() -> (ReplyService, mpsc::Sender<ReplyMsg>) {
        let ( reply_service_sender, reply_service_receiver ) : (mpsc::Sender<ReplyMsg>, mpsc::Receiver<ReplyMsg>)= mpsc::channel(32);
        (ReplyService {
            cmd_map: HashMap::new(),
            reply_service_receiver
        }, reply_service_sender)
    }

    pub async fn start_reply_service(&mut self, window: &Window) {
        println!("Initializing reply service!");

        while let Some(msg) = self.reply_service_receiver.recv().await {
            match msg {
                ReplyMsg::MatchMsg(container) => {
                    
                    window.emit("reply", container).unwrap();
                    /* 
                    let cmd_match = format!("{}?{}", container.heos.command, container.heos.message);
                    match self.cmd_map.remove(&cmd_match) {
                        Some(_) => {
                            // tauri: found a match, emit the reply to frontend
                            
                            window.emit("reply", container).unwrap();

                            println!("Emitted reply to: {}", &cmd_match);
                        },
                        None => {
                            println!("Couldn't match reply!");
                        }
                    }
                    */
                },
                ReplyMsg::MapMsg(cmd, one_tx) => {
                    match self.cmd_map.insert(cmd.clone(), None) {
                        _ => one_tx.send(()).unwrap()
                    }
                    
                    //println!("Inserted cmd: {}", &cmd);
                },
                ReplyMsg::EventMsg(container) => {
                    // tauri: emit event to front end

                    window.emit("event", container.clone()).unwrap();

                    //println!("Emitted event: {:?}", container);
                }
            }
        }
        
        println!("Shutting down reply service.");
    }
}