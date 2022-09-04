import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { invoke } from "@tauri-apps/api";
import getMinecraftFolder from "../../tools/getMinecraftFolder";
const mcFolder = await getMinecraftFolder();
export default function Selector() {
  const [options, setOptions] = useState(["No options"]);

  const func = async () => {
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

  func.call({});

  return (
    <>
      <div className="selector">
        <Autocomplete
          options={options}
          disablePortal
          id="selectorAutocomplete"
          sx={{ width: 290 }}
          renderInput={(params) => (
            <TextField {...params} label="Modpack" />
          )}></Autocomplete>
      </div>
    </>
  );
}
