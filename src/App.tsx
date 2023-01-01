import React, { useState } from "react";
import ProductTitle from "./components/heading/heading";
import Installer from "./components/modpackInstaller-new/Installer";
import Selector from "./components/selector/Selector";
import { Center, ChakraProvider } from "@chakra-ui/react";
function App() {

  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);
  const [downloadProgressElement, setDownloadProgressElement] = useState<any>();
  return (
    <div className="container">
      <ChakraProvider>
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
      </ChakraProvider>
    </div>
  );
}
export default App;
