import { Alert, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import "./installer.css";
import { open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import { tempdir } from "@tauri-apps/api/os";
import getMinecraftFolder from "../../tools/getMinecraftFolder";
import { invoke } from "@tauri-apps/api";
import { ask } from "@tauri-apps/api/dialog";

interface RefScheme {
  downloadUrl: string;
  name: string;
}

export default function Installer() {
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [downloadProgressElement, setDownloadProgressElement] =
    useState<any>(null);

  const install = async () => {
    const selected = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Modpack Reference",
          extensions: ["mcmodpackref"],
        },
      ],
    });
    if (selected === null || Array.isArray(selected)) {
      setDownloadProgressElement(
        <>
          <Alert className="filealert" severity="error">
            No proper file was selected.
          </Alert>
        </>
      );
    } else {
      const conts = await readTextFile(selected);
      const reference: RefScheme = await JSON.parse(conts);
      setDownloadProgressElement(<CircularProgress />);
      const tempdirPath = await tempdir();
      const mcFolder = await getMinecraftFolder();
      try {
        await invoke("install_mc_mods", {
          minecraftfolder: mcFolder,
          tempdir: tempdirPath,
          mdpckname: reference.name,
          downloadUrl: reference.downloadUrl,
          forceinstall: false,
        });
        setDownloadProgressElement(
          <Alert severity="success">
            Modpack has been installed successfully
          </Alert>
        );
      } catch (e: any) {
        if (e === "Modpack exists") {
          let res = await ask("Modpack exists, do you want to overwrite it?", {
            title: "Minecraft modpack manager",
          });
          if (res === true) {
            try {
              await invoke("install_mc_mods", {
                minecraftfolder: mcFolder,
                tempdir: tempdirPath,
                mdpckname: reference.name,
                downloadUrl: reference.downloadUrl,
                forceinstall: true,
              });
              setDownloadProgressElement(
                <Alert severity="success">
                  Modpack has been installed successfully
                </Alert>
              );
            } catch (err: any) {
              setDownloadProgressElement(
                <Alert severity="error">
                  Error while installing modpack ({err})
                </Alert>
              );
            }
          } else {
            setDownloadProgressElement(
              <Alert severity="error">
                Error while installing modpack ({e})
              </Alert>
            );
          }
        } else {
          setDownloadProgressElement(
            <Alert severity="error">Error while installing modpack ({e})</Alert>
          );
        }
      }
    }
  };

  return (
    <>
      <div className="installer">
        <Button variant="outlined" onClick={install}>
          Install a modpack from a reference file
        </Button>
        <br></br>
        <div className="Progress">{downloadProgressElement}</div>
      </div>
    </>
  );
}
