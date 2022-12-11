import { ThemeProvider } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import { invoke } from "@tauri-apps/api";
import React, { useState } from "react";
import Heading from "./components/heading/heading";
import Installer from "./components/modpackInstaller-new/Installer";
import Selector from "./components/selector/Selector";

function App() {

  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);
  const [downloadProgressElement, setDownloadProgressElement] = useState<any>();
  return (
    <div className="container">
      <ThemeProvider theme={darkTheme}>
        <Heading></Heading>
        <Selector
          isButtonEnabled={isButtonEnabled}
          setIsButtonEnabled={setIsButtonEnabled}
          setDownloadProgressElement={setDownloadProgressElement}
          downloadProgressElement={downloadProgressElement}></Selector>
        <Installer
          isButtonEnabled={isButtonEnabled}
          setIsButtonEnabled={setIsButtonEnabled}
          setDownloadProgressElement={setDownloadProgressElement}
          downloadProgressElement={downloadProgressElement}></Installer>
        <div>{downloadProgressElement}</div>
      </ThemeProvider>
    </div>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default App;
