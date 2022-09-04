import React, { useState } from "react";
import { Typography } from "@mui/material";
import "./heading.css";

export default function Heading() {
  return (
    <>
      <div className="heading">
        <Typography variant="h3">{"Minecraft Modpack Manager"}</Typography>
      </div>
    </>
  );
}
