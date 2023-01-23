import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import "./tools/translation/i18n";
import { ColorModeScript } from '@chakra-ui/react'
import theme from './theme'
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>
);
