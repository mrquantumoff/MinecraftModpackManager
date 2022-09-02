import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
export default function Selector() {
  const [options, setOptions] = useState([]);

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
