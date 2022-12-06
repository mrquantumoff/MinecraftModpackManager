import { Alert, Button, LinearProgress } from "@mui/material";
import React, { useState } from "react";
import "./installer.css";
import { open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import { tempdir } from "@tauri-apps/api/os";
import getMinecraftFolder from "../../tools/getMinecraftFolder";
import { invoke } from "@tauri-apps/api";
import { ask } from "@tauri-apps/api/dialog";
import { IInstallerProps, InstallerConfig, RefScheme } from "../../Interfaces";


export default function LegacyInstaller(props: IInstallerProps) {
  const isButtonEnabled = props.isButtonEnabled;
  const setIsButtonEnabled = props.setIsButtonEnabled;

  const [downloadProgressElement, setDownloadProgressElement] =
    useState<any>(null);


  const install = async () => {
    await RefInstall({
      setIsButtonEnabled: setIsButtonEnabled,
      setDownloadProgressElement: setDownloadProgressElement,
    })
  }


  return (
    <>
      <div className="installer">
        <Button
          className="installer"
          onClick={install}
          disabled={!isButtonEnabled}>
          Install a modpack from a reference file directly (legacy)
        </Button>
        <div className="installer progress">{downloadProgressElement}</div>
      </div>
    </>
  );
}



export const RefInstall = async (config: InstallerConfig) => {
  const setIsButtonEnabled = config.setIsButtonEnabled;
  const setDownloadProgressElement = config.setDownloadProgressElement;;

  setIsButtonEnabled(false);
  const selected = await open({
    multiple: false,
    directory: false,
    filters: [
      {
        name: "Modpack Reference",
        extensions: ["mcmodpackref", "mcmodpackref.json", "qntmdpck.json"],
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