#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![allow(dead_code)]

/// Boilerplate code for tauri
#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
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
async fn get_modpack_options() -> Result<Option<Vec<String>>, String> {
    todo!()
}
