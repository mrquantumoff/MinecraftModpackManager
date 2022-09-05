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
        .invoke_handler(tauri::generate_handler![
            get_modpack_options,
            clear_modpack,
            set_modpack
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Shoud create a new folder called Modpacks in .minecraft (if not exists)
/// Will iterate through all subfolders
/// In the end it should return the options vector
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
                                if split[split.len() - 1].to_string() != "free" {
                                    out.push(split[split.len() - 1].to_string());
                                }
                            }
                            #[cfg(windows)]
                            {
                                let path = entry.path().to_str().unwrap().to_string();
                                let split: Vec<&str> = path.split("\\").collect();
                                if split[split.len() - 1].to_string() != "free" {
                                    out.push(split[split.len() - 1].to_string());
                                }
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

#[allow(unreachable_code)]
#[tauri::command]
async fn clear_modpack(minecraftfolder: String) -> Result<(), String> {
    println!(
        "{} \n{}",
        &minecraftfolder,
        PathBuf::from(&minecraftfolder)
            .join("mods")
            .to_str()
            .unwrap()
    );
    let _mdpckpath = PathBuf::from(&minecraftfolder).join("modpacks");
    if !_mdpckpath.join("free").exists() {
        // Create a new folder
        let res = create_dir_all(&_mdpckpath.join("free"));
        match res {
            Ok(_) => {}
            Err(_) => return Err("Failed to create free modpack folder".to_string()),
        }
    }

    if PathBuf::from(&minecraftfolder).join("mods").exists() {
        let res = std::fs::remove_dir_all(PathBuf::from(&minecraftfolder).join("mods"));
        match res {
            Ok(_) => {}
            Err(_) => return Err("Failed removing mods".to_string()),
        }
    }

    #[cfg(unix)]
    {
        let res = std::os::unix::fs::symlink(
            &_mdpckpath.join("free"),
            PathBuf::from(minecraftfolder).join("mods"),
        );
        match res {
            Ok(_) => return Ok(()),
            Err(e) => return Err("Failed to create a symlink to free modpack folder".to_string()),
        }
    }
    #[cfg(windows)]
    {
        let res = std::os::windows::fs::symlink_dir(
            &_mdpckpath.join("free"),
            PathBuf::from(minecraftfolder).join("mods"),
        );
        match res {
            Ok(_) => return Ok(()),
            Err(e) => {
                return Err(
                    "Failed to create a symlink to free modpack folder: ".to_string()
                        + &e.kind().to_string(),
                )
            }
        }
    }
    return Err("Unknown os".to_string());
}

#[allow(unreachable_code)]
#[tauri::command]
async fn set_modpack(minecraftfolder: String, modpack: String) -> Result<(), String> {
    println!(
        "{} \n{}",
        &minecraftfolder,
        PathBuf::from(&minecraftfolder)
            .join("mods")
            .to_str()
            .unwrap()
    );
    let _mdpckpath = PathBuf::from(&minecraftfolder).join("modpacks");

    if PathBuf::from(&minecraftfolder).join("mods").exists() {
        let res = std::fs::remove_dir_all(PathBuf::from(&minecraftfolder).join("mods"));
        match res {
            Ok(_) => {}
            Err(_) => return Err("Failed removing mods".to_string()),
        }
    }

    #[cfg(unix)]
    {
        let res = std::os::unix::fs::symlink(
            &_mdpckpath.join(modpacks),
            PathBuf::from(minecraftfolder).join("mods"),
        );
        match res {
            Ok(_) => return Ok(()),
            Err(e) => return Err("Failed to create a symlink to free modpack folder".to_string()),
        }
    }
    #[cfg(windows)]
    {
        let res = std::os::windows::fs::symlink_dir(
            &_mdpckpath.join(modpack),
            PathBuf::from(minecraftfolder).join("mods"),
        );
        match res {
            Ok(_) => return Ok(()),
            Err(e) => {
                return Err(
                    "Failed to create a symlink to free modpack folder: ".to_string()
                        + &e.kind().to_string(),
                )
            }
        }
    }
    return Err("Unknown os".to_string());
}
