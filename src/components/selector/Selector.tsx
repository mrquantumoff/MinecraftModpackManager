import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { invoke } from "@tauri-apps/api";
import getMinecraftFolder from "../../tools/getMinecraftFolder";
import "./Selector.css";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { platform } from "@tauri-apps/api/os";
import { Alert, LinearProgress } from "@mui/material";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch, exit } from "@tauri-apps/api/process";
import { confirm } from "@tauri-apps/api/dialog";
import { IInstallerProps } from "../modpackinstaller/installer";

export default function Selector(props: IInstallerProps) {
  const [options, setOptions] = useState(["No options"]);
  const isAutoCompleteActive = props.isButtonEnabled;
  const setIsAutoCompleteActive = props.setIsButtonEnabled;
  const [progress, setProgress] = useState<any>(null);

  const openModpack = async () => {
    const mcFolder = await getMinecraftFolder();
    await invoke("open_modpacks_folder", { minecraftfolder: mcFolder });
  };

  const [openModpackFolder, setOpenModpackFolder] = useState<any>(
    <>
      <div className="openmodpackfolder">
        <Button
          variant="contained"
          disabled={!isAutoCompleteActive}
          onClick={openModpack}>
          Open modpacks folder
        </Button>
      </div>
    </>
  );

  // Set mods folder free
  const setModsFree = async () => {
    const mcFolder = await getMinecraftFolder();
    const os = await platform();
    setIsAutoCompleteActive(false);
    setProgress(<LinearProgress />);
    try {
      await invoke("clear_modpack", { minecraftfolder: mcFolder });
      setIsAutoCompleteActive(true);
      setProgress(
        <Alert severity="success">Modpack cleared successfully</Alert>
      );
    } catch (err) {
      console.error(err);
      if (os === "win32") {
        setProgress(
          <Alert severity="error">
            Failed to clear modpacks, try running the app as admin
          </Alert>
        );
      } else {
        setProgress(<Alert severity="error">Failed to clear modpacks</Alert>);
      }
      setIsAutoCompleteActive(true);
    }
  };

  const applyModpack = async () => {
    const os = await platform();
    try {
      setIsAutoCompleteActive(false);
      setProgress(<LinearProgress />);
      const mcFolder = await getMinecraftFolder();
      if (autoCompleteValue === null) {
        setProgress(
          <Alert severity="warning">
            Please choose a modpack or set mods free by clearing the modpack
          </Alert>
        );
      } else {
        await invoke("set_modpack", {
          minecraftfolder: mcFolder,
          modpack: autoCompleteValue,
        });
      }
      setIsAutoCompleteActive(true);
      setProgress(<Alert severity="success">Modpack set successfully</Alert>);
    } catch (err) {
      console.error(err);
      if (os == "win32") {
        setProgress(
          <Alert severity="error">
            Failed to clear modpacks, try running the app as admin
          </Alert>
        );
      } else {
        setProgress(<Alert severity="error">Failed to clear modpacks</Alert>);
      }
      setIsAutoCompleteActive(true);
    }
  };

  // Gets options from the backend
  const func = async () => {
    const os = await platform();
    try {
      if (os === "darwin") {
        setOpenModpackFolder(null);
      }
      await invoke("close_splashscreen");
      const { shouldUpdate } = await checkUpdate();
      if (shouldUpdate) {
        setIsAutoCompleteActive(false);
        setProgress(
          <>
            <Alert severity="info">Updating modpack manager...</Alert>
            <br></br>
            <LinearProgress />
          </>
        );

        await installUpdate();
        // install complete, restart app
        await relaunch();
      }
    } catch (error: any) {
      if (os==="linux") {
        setIsAutoCompleteActive(true);
        setProgress(<Alert severity="warning">Error while updating, don't worry if you run flathub edition, the update will be available in 30-40 minutes, else you should read the error message ({error})</Alert>);
      }
      else {
        setProgress(<Alert severity="error">{error}</Alert>);
      }
      console.log(error);
    }

    const mcFolder = await getMinecraftFolder();

    try {
      const areModsSymlinks: boolean = await invoke("are_mods_symlinks", {
        minecraftfolder: mcFolder,
      });
      if (areModsSymlinks) {
        const confirmed = await confirm(
          "Warning: it seems that your mods aren't symlinked to the modpacks directory, this means any action (clear/apply) will result deleting your currently installed mods",
          "Data loss warning"
        );
        if (!confirmed) {
          exit(1);
        }
      }
    } catch (error: any) {
      console.error(error);
    }

    try {
      const res: string[] = await invoke("get_modpack_options", {
        minecraftfolder: mcFolder,
      });
      setOptions(res);
    } catch (err) {
      console.error(err);
      setOptions(["Failed to get modpack options (" + err + ")"]);
    }
  };

  useEffect(() => {
    func.call({});
  }, []);

  const [autoCompleteValue, setAutoCompleteValue] = useState<string | null>(
    null
  );

  window.onerror = function stoperror() {
    return true;
  };

  return (
    <>
      <div className="selector">
        <Autocomplete
          options={options}
          disablePortal
          id="selectorAutocomplete"
          sx={{ width: 290 }}
          value={autoCompleteValue}
          readOnly={!isAutoCompleteActive}
          onChange={(event: any, newValue: null | string) => {
            console.log("Autocomplete value: " + newValue);
            if (typeof newValue === "string") {
              if (options.includes(newValue)) setAutoCompleteValue(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Modpack" />
          )}></Autocomplete>
      </div>
      <div className="buttons">
        <ButtonGroup variant="contained" disabled={!isAutoCompleteActive}>
          <Button disabled={autoCompleteValue === null} onClick={applyModpack}>
            Apply
          </Button>
          <Button onClick={setModsFree}>Clear</Button>
          <Button onClick={func}>Reload</Button>
        </ButtonGroup>
      </div>
      {progress}
      <br></br>
      {openModpackFolder}
    </>
  );
}
