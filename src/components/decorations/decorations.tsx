import { ChakraProvider, CloseButton, IconButton } from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'
import React from "react";
import { exit } from "@tauri-apps/api/process"
import "./decorations.css"
import { CloseIcon, SettingsIcon } from "@chakra-ui/icons";

export default function Decorations() {
    return (<>
        <ChakraProvider>
            <div data-tauri-drag-region className="decorations">
                <div className="decorations-in">
                    <div className="decoration-item">

                        <IconButton icon={<CloseIcon />} onClick={() => {
                            exit(0).catch(console.error);
                        }} aria-label={""}></IconButton>
                    </div>
                    <div className="decoration-item">
                        <Menu>
                            <MenuButton as={IconButton} icon={<SettingsIcon />}></MenuButton>
                        </Menu>
                    </div>
                </div>
            </div>
        </ChakraProvider>
    </>)
}