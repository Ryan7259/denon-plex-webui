use std::time::Duration;
use ssdp_client::{self, URN};
use regex::Regex;
use futures::StreamExt;

#[tauri::command]
pub async fn find_denon_devices() -> Vec<String> {
    // urn:schemas-denon-com:device:ACT-Denon:1
    let search_target = URN::device("schemas-denon-com", "ACT-Denon", 1).into();
    let timeout = Duration::from_secs(2);
    let mut responses = ssdp_client::search(&search_target, timeout, 2).await.expect("Failed to search for devices!");

        //"http://192.168.7.186:60006/upnp/desc/aios_device/aios_device.xml"
    let re = Regex::new(r"\d+.\d+.\d+.\d+").unwrap();
    let mut denon_devices : Vec<String> = Vec::new();
    while let Some(response) = responses.next().await {
        let response = response.unwrap();

        if response.search_target().to_string() == search_target.to_string() {
            println!("-{}: {}", response.search_target(), response.location());

            if let Some(ip) = re.captures(response.location().into()).unwrap().get(0) {
                denon_devices.push(ip.as_str().into());
            }
        }
    }

    denon_devices
}