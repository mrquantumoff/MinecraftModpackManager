#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![allow(dead_code)]

use std::path::PathBuf;

use std::fs;

use tauri::Manager;

use std::fs::File;

use std::io::Write;

use std::fs::create_dir_all;

/// Boilerplate code for tauri
#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_modpack_options,
            clear_modpack,
            set_modpack,
            open_modpacks_folder,
            are_mods_symlinks,
            close_splashscreen,
            install_mc_mods
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
            &_mdpckpath.join(modpack),
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

#[tauri::command]
async fn open_modpacks_folder(minecraftfolder: String) {
    let _mdpckpath = PathBuf::from(&minecraftfolder).join("modpacks");
    if !_mdpckpath.exists() {
        // Create a new folder
        let res = create_dir_all(&_mdpckpath);
        match res {
            Ok(_) => {}
            Err(_) => {}
        }
    }
    std::env::set_current_dir(_mdpckpath).expect("error switching to another folder");
    std::process::Command::new("explorer.exe")
        .arg(".")
        .output()
        .expect("Failed to open modpacks folder");
}

#[tauri::command]
async fn are_mods_symlinks(minecraftfolder: String) -> Result<bool, String> {
    let _mdpckpath = PathBuf::from(&minecraftfolder).join("mods");
    let metadata = fs::metadata(&_mdpckpath);
    match metadata {
        Ok(_metadata) => {
            return Ok(!_mdpckpath.is_symlink());
        }
        Err(_) => return Err("Failed to get metadata".to_string()),
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn test() -> Result<(), String> {
        #[cfg(target_os = "linux")]
        {
            let mcdir = "~/.minecraft".to_string();
            return futures::executor::block_on(crate::clear_modpack(mcdir));
        }
        #[cfg(target_os = "macos")]
        {
            let mcdir = String::from("~/Library/Application Support/minecraft");
            return futures::executor::block_on(crate::clear_modpack(mcdir));
        }
        Ok(())
    }
}

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

#[tauri::command]
async fn install_mc_mods(
    download_url: &str,
    minecraftfolder: &str,
    tempdir: &str,
    mdpckname: &str,
    forceinstall: bool,
) -> Result<(), String> {
    let moda = PathBuf::from(tempdir).join("modpack.zip");
    let file = File::create(&moda);
    let mdpckdir: PathBuf = PathBuf::from(minecraftfolder)
        .join("modpacks")
        .join(mdpckname);

    if mdpckdir.exists() {
        if !forceinstall {
            return Err("Modpack exists".to_string());
        } else {
            let res = fs::remove_dir_all(&mdpckdir);
            match res {
                Ok(_) => {}
                Err(_) => return Err("Failed to overwrite modpack".to_string()),
            }
        }
    }
    match file {
        Ok(mut f) => {
            let request = reqwest::get(download_url).await;
            match request {
                Ok(mut request) => {
                    while let Some(chunk) =
                        request.chunk().await.expect("Error while loading chunks")
                    {
                        let res = f.write_all(&chunk);
                        match res {
                            Ok(_) => {}
                            Err(_) => return Err("Error writing file chunk".to_string()),
                        }
                    }
                }
                Err(_) => {
                    println!("Failed to create the request");

                    return Err("Failed to create the request".to_string());
                }
            }
        }
        Err(_) => {
            println!("Failed to create the zip file");

            return Err("Failed to create the zip file".to_string());
        }
    }

    let dirres = create_dir_all(&mdpckdir);

    match dirres {
        Ok(_) => {}
        Err(_) => return Err("Directory creation error".to_string()),
    }

    let file = File::open(&moda);
    match file {
        Ok(fileok) => {
            let archive = zip::ZipArchive::new(&fileok);
            match archive {
                Ok(mut archive) => {
                    let finalres = archive.extract(&mdpckdir);
                    match finalres {
                        Ok(_) => {
                            let cleanupres = fs::remove_file(&moda);
                            match cleanupres {
                                Ok(()) => {}
                                Err(_) => return Err(
                                    "Failed to clean up (but modpack is installed successfully)"
                                        .to_string(),
                                ),
                            }
                        }
                        Err(_) => {
                            println!("");
                            return Err("Failed to extract zip archive".to_string());
                        }
                    }
                }
                Err(_) => {
                    println!("UnZipError (322)");
                    return Err("Failed to extract zip archive (322)".to_string());
                }
            }
        }
        Err(_) => {
            println!("ArchiveError(328)");
            return Err("Failed to extract zip archive (328)".to_string());
        }
    }

    Ok(())
}
