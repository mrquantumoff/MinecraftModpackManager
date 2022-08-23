import React, { useState } from "react";
import { Typography } from "@mui/material";
import "./heading.css";
import lang, { getLanguageTranslation } from "../common/translation";

export default function Heading() {
  const [productName, setProductName] = useState();
  const f = async () => {
    setProductName(await getLanguageTranslation(lang, "productName"));
  };
  f.call("");
  return (
    <>
      <div>
        <Typography variant="h3" className="heading">
          {productName}
        </Typography>
      </div>
    </>
  );
}
