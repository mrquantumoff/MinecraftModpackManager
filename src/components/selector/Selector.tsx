import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { invoke } from "@tauri-apps/api";
import getMinecraftFolder from "../../tools/getMinecraftFolder";
import "./Selector.css";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { platform } from "@tauri-apps/api/os";
import { Alert, CircularProgress } from "@mui/material";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";

export default function Selector() {
  const [options, setOptions] = useState(["No options"]);
  const [isAutoCompleteActive, setIsAutoCompleteActive] =
    useState<boolean>(true);
  const [progress, setProgress] = useState<any>(null);

  // Set mods folder free
  const setModsFree = async () => {
    const mcFolder = await getMinecraftFolder();
    const os = await platform();
    setIsAutoCompleteActive(false);
    setProgress(<CircularProgress />);
    try {
      await invoke("clear_modpack", { minecraftfolder: mcFolder });
      setIsAutoCompleteActive(true);
      setProgress(
        <Alert severity="success">Modpack cleared successfully</Alert>
      );
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

  const applyModpack = async () => {
    const os = await platform();
    try {
      setIsAutoCompleteActive(false);
      setProgress(<CircularProgress />);
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
    try {
      const { shouldUpdate } = await checkUpdate();
      if (shouldUpdate) {
        setIsAutoCompleteActive(false);
        setProgress(
          <>
            <Alert severity="info">Updating modpack manager...</Alert>
            <br></br>
            <CircularProgress />
          </>
        );

        await installUpdate();
        // install complete, restart app
        await relaunch();
      }
    } catch (error) {
      console.log(error);
    }
    const mcFolder = await getMinecraftFolder();

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
          <Button onClick={applyModpack}>Apply</Button>
          <Button onClick={setModsFree}>Clear</Button>
          <Button onClick={func}>Reload</Button>
        </ButtonGroup>
      </div>
      <br></br>
      {progress}
    </>
  );
}
