import { ThemeProvider } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import React, { useState } from "react";
import Heading from "./components/heading/heading";
import Installer from "./components/modpackinstaller/installer";
import Selector from "./components/selector/Selector";

function App() {
  // Disable right click to fix some bugs
  // document.addEventListener("contextmenu", (event) => {
  //   event.preventDefault();
  // });
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);
  return (
    <div className="container">
      <ThemeProvider theme={darkTheme}>
        <Heading></Heading>
        <Selector
          isButtonEnabled={isButtonEnabled}
          setIsButtonEnabled={setIsButtonEnabled}></Selector>
        <Installer
          isButtonEnabled={isButtonEnabled}
          setIsButtonEnabled={setIsButtonEnabled}></Installer>
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
