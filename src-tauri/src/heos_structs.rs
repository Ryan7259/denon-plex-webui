use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HeosContainer {
    pub heos: HeosResponse,

    #[serde(flatten)]
    pub payload: HashMap<String, serde_json::Value>,

    #[serde(flatten)]
    pub options: HashMap<String, serde_json::Value>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HeosResponse {
    pub command: String,
    pub message: Option<String>,
    pub result: Option<String>
}

/*
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HeosPayload(Vec<HashMap<String, serde_json::Value>>);
*/