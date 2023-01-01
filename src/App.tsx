import React, { useState } from "react";
import ProductTitle from "./components/heading/heading";
import Installer from "./components/modpackInstaller-new/Installer";
import Selector from "./components/selector/Selector";
import { Center, ChakraProvider, Container } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import Decorations from "./components/decorations/decorations";

function App() {

  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);
  const [downloadProgressElement, setDownloadProgressElement] = useState<any>();
  // invoke("close_splashscreen").catch(() => { });
  return (

    <ChakraProvider>
      <Decorations></Decorations>
      <div className="container">
        <ProductTitle></ProductTitle>
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
      </div>
    </ChakraProvider>

  );
}
export default App;
