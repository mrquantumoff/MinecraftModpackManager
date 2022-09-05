import { readTextFile, BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
export default function getCurrentModpack() {
  try {
    let conts = readTextFile("currentModpack.json", {
      dir: BaseDirectory.Config,
    })
      .then((conts) => {
        let json = JSON.parse(conts);
        return json?.currentModpack;
      })
      .catch(() => {
        throw new Error("Promise panicked");
      });
  } catch (e) {
    try {
      let obj = {
        currentModpack: null,
      };
      writeTextFile("currentModpack.json", JSON.stringify(obj), {
        dir: BaseDirectory.Config,
      })
        .then(() => {})
        .catch(() => {
          throw new Error("Promise panicked");
        });
    } catch (e) {
      throw new Error("Failed to write currentModpack.json");
    }
  }
}
export async function setCurrentModpack(modpack: string | null) {
  try {
    let obj = {
      currentModpack: { modpack },
    };
    await writeTextFile("currentModpack.json", JSON.stringify(obj), {
      dir: BaseDirectory.Config,
    });
  } catch (e) {
    throw new Error("Failed to write currentModpack.json");
  }
}
