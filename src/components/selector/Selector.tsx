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
import getCurrentModpack, {
  setCurrentModpack,
} from "../../tools/currentModpack";

export default function Selector() {
  const [options, setOptions] = useState(["No options"]);
  const [isAutoCompleteActive, setIsAutoCompleteActive] =
    useState<boolean>(true);
  const [progress, setProgress] = useState<any>(null);
  const [defaultValue, setDefaultValue] = useState<any>(getCurrentModpack());
  // Set mods folder free
  const setModsFree = async () => {
    const mcFolder = await getMinecraftFolder();
    const os = await platform();
    setIsAutoCompleteActive(false);
    setProgress(<CircularProgress />);
    try {
      await invoke("clear_modpack", { minecraftfolder: mcFolder });
      setIsAutoCompleteActive(true);
      setProgress(null);
      setCurrentModpack(null);
    } catch (err) {
      console.error(err);
      if (os == "win32") {
        setCurrentModpack(null);
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
    try {
      setCurrentModpack(autoCompleteValue);
    } catch (e) {}
  };

  // Gets options from the backend
  const func = async () => {
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
          defaultValue={defaultValue}
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
          <Button>Apply</Button>
          <Button>New</Button>
          <Button onClick={setModsFree}>Clear</Button>
        </ButtonGroup>
      </div>
      <br></br>
      {progress}
    </>
  );
}
