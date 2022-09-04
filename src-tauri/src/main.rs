#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![allow(dead_code)]

use std::path::PathBuf;

use std::fs::create_dir_all;

/// Boilerplate code for tauri
#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_modpack_options])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Shoud create a new folder called Modpacks in .minecraft (if not exists)
/// Will iterate through all subfolders
/// Will try to read and/or create a file called "modpack.json" with data about mod loader, game version, displayName of the modpack
/// Then it will add the display name to the options vector
/// In the end it should return the options vector
/// todo: the function itself
#[tauri::command]
async fn get_modpack_options(minecraftfolder: String) -> Result<Vec<String>, String> {
    let _mdpckpath = PathBuf::from(minecraftfolder).join("modpacks");
    // Check if the folder exists
    if !_mdpckpath.exists() {
        // Create a new folder
        let res = create_dir_all(&_mdpckpath);
        match res {
            Ok(_) => {}
            Err(_) => return Err("Failed to create modpack folder".to_string()),
        }
    }
    let readres = _mdpckpath.clone().read_dir();
    let mut out: Vec<String> = Vec::new();
    match readres {
        Ok(res) => {
            for entry in res {
                match entry {
                    Ok(entry) => {
                        if entry.path().is_dir() {
                            #[cfg(unix)]
                            {
                                let path = entry.path().to_str().unwrap().to_string();
                                let split: Vec<&str> = path.split("/").collect();
                                out.push(split[split.len() - 1].to_string());
                            }
                            #[cfg(windows)]
                            {
                                let path = entry.path().to_str().unwrap().to_string();
                                let split: Vec<&str> = path.split("\\").collect();
                                out.push(split[split.len() - 1].to_string());
                            }
                        }
                    }
                    Err(_) => return Err("Failed to read entry".to_string()),
                }
            }
        }
        Err(_) => return Err("Failed to read modpack folder".to_string()),
    }
    return Ok(out);
}
