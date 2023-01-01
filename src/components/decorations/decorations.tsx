import { Button, Center, ChakraProvider, CloseButton } from "@chakra-ui/react";
import React from "react";
import { exit } from "@tauri-apps/api/process"
import "./decorations.css"
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function Decorations() {
    return (<>
        <ChakraProvider>
            <div data-tauri-drag-region className="decorations">
                <div className="decorations-in">
                    <CloseButton onClick={() => {
                        exit(0).catch(console.error);
                    }}></CloseButton>
                </div>
            </div>
        </ChakraProvider>
    </>)
}