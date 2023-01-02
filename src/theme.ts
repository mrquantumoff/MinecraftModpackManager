// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
// 2. Add your color mode config
import * as Window from "@tauri-apps/api/window"


// Fix dark mode in case it's not working properly

function start() {
  const currentWindow = Window.getCurrent();
  let final: "light" | "dark" = "dark";
  const theme = currentWindow.theme().catch(console.error).then((res) => {
    if (res === "dark") {
      window.localStorage.setItem('chakra-ui-color-mode', 'dark');
    }
    else {
      window.localStorage.setItem('chakra-ui-color-mode', 'light');
    }
    final = (window.localStorage.getItem('chakra-ui-color-mode') === "dark") ? "dark" : "light";
    
  })
  const config: ThemeConfig = {
      initialColorMode: final,
      useSystemColorMode: true,
    }
    
    // 3. extend the theme
    const newTheme = extendTheme({ config })
    return newTheme;
    ;

}


const theme = start();

export default theme;