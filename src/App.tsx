import React, { useState } from "react";
import ProductTitle from "./components/heading/heading";
import Installer from "./components/modpackInstaller-new/Installer";
import Selector from "./components/selector/Selector";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import Decorations from "./components/decorations/decorations";
import theme from './theme'

export default function App() {

  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);
  const [downloadProgressElement, setDownloadProgressElement] = useState<any>();

  return (
    <ChakraProvider theme={theme}>
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
