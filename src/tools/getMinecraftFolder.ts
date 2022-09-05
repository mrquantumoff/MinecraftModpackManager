import { platform } from "@tauri-apps/api/os";
import { homeDir, join } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/api/fs";

// Gets the .minecraft folder
export default async function getMinecraftFolder() {
  let plt = await platform();
  if (plt === "darwin") {
    return await join(
      await homeDir(),
      "Library",
      "Application Support",
      "minecraft"
    );
    //  "~/Library/Application Support/minecraft";
  } else if (plt === "win32") {
    return await join(await homeDir(), "AppData", "Roaming", ".minecraft");
  } else {
    return await join(await homeDir(), ".minecraft");
  }
}

// Modpack info interface
export interface IModpackInfo {
  displayName: string;
  gameVersion: string;
  modLoader: string;
}

// Gets data about a specific modpack
export async function getModpackInfo(modpackName: string) {
  // Gets the path for the file
  let modDataFilePath = await join(
    await getMinecraftFolder(),
    "Modpacks",
    modpackName,
    "modpack.json"
  );

  // Reads an parses the json
  const rawdata = await readTextFile(modDataFilePath);
  const data = JSON.parse(rawdata);
  // Returns an object
  const modPackinfo: IModpackInfo = {
    displayName: data.displayName || "Unknown displayName",
    modLoader: data.modLoader || "Unknown modLoader",
    gameVersion: data.gameVersion || "Unknown gameVersion",
  };
  return modPackinfo;
}
