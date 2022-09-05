import { ThemeProvider } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import React from "react";
import Heading from "./components/heading/heading";
import Selector from "./components/selector/Selector";

function App() {
  // document.addEventListener("contextmenu", (event) => {
  //   event.preventDefault();
  // });
  return (
    <div className="container">
      <ThemeProvider theme={darkTheme}>
        <Heading></Heading>
        <Selector></Selector>
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
