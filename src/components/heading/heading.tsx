import React, { useState } from "react";
import { Typography } from "@mui/material";
import "./heading.css";

export default function Heading() {
  return (
    <>
      <div>
        <Typography variant="h3" className="heading">
          {"Minecraft Modpack Manager"}
        </Typography>
      </div>
    </>
  );
}
