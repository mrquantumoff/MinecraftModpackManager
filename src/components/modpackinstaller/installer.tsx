import { Alert, Button, LinearProgress } from "@mui/material";
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

export interface IInstallerProps {
  isButtonEnabled: boolean;
  setIsButtonEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Installer(props: IInstallerProps) {
  const isButtonEnabled = props.isButtonEnabled;
  const setIsButtonEnabled = props.setIsButtonEnabled;

  const [downloadProgressElement, setDownloadProgressElement] =
    useState<any>(null);

  const install = async () => {
    setIsButtonEnabled(false);
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
          <Alert className="alert" severity="error">
            No proper file was selected.
          </Alert>
        </>
      );
    } else {
      const conts = await readTextFile(selected);
      const reference: RefScheme = await JSON.parse(conts);
      setDownloadProgressElement(<LinearProgress />);

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
          <Alert className="alert" severity="success">
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
                <Alert className="alert" severity="success">
                  Modpack has been installed successfully
                </Alert>
              );
            } catch (err: any) {
              setDownloadProgressElement(
                <Alert className="alert" severity="error">
                  Error while installing modpack ({err})
                </Alert>
              );
            }
          } else {
            setDownloadProgressElement(
              <Alert className="alert" severity="error">
                Error while installing modpack ({e})
              </Alert>
            );
          }
        } else {
          setDownloadProgressElement(
            <Alert className="alert" severity="error">
              Error while installing modpack ({e})
            </Alert>
          );
        }
      }
    }
    setIsButtonEnabled(true);
  };

  return (
    <>
      <div></div>
      <Button
        className="installer"
        variant="outlined"
        onClick={install}
        disabled={!isButtonEnabled}>
        Install a modpack from a reference file
      </Button>
      <div className="installer progress">{downloadProgressElement}</div>
    </>
  );
}
