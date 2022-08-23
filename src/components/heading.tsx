import React from "react";
import { Typography } from "@mui/material";
import "./heading.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function Heading() {
  return (
    <>
      <div>
        <Typography variant="h3" className="heading">
          Minecraft Modpack manager
        </Typography>
      </div>
    </>
  );
}
