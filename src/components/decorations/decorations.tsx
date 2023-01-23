import { Button, ChakraProvider, CloseButton, IconButton } from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import React, { useState } from "react";
import { exit } from "@tauri-apps/api/process"
import "./decorations.css"
import { useTranslation } from "react-i18next";
import { ChatIcon, CloseIcon, SettingsIcon } from "@chakra-ui/icons";

const languages: any = {
    en: { nativeName: "English" },
    uk: { nativeName: "Українська" }
}

export default function Decorations() {
    const { t, i18n } = useTranslation();
    const [isLanguagesMenuOpen, setIsLanguagesMenuOpen] = useState(false);
    return (<>
        <ChakraProvider>
            <Modal isOpen={isLanguagesMenuOpen} onClose={() => { }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        {Object.keys(languages).map((key: any) => {
                            let lang: any = Object.values(languages)[Object.keys(languages).indexOf(key)];
                            let nativeName: any = lang.nativeName;
                            return <>
                                <div className="language">
                                    <Button onClick={() => {
                                        i18n.changeLanguage(key);
                                        setIsLanguagesMenuOpen(false);
                                    }} isDisabled={i18n.resolvedLanguage == key}>
                                        {nativeName}
                                    </Button>
                                </div>
                            </>
                        })}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => {
                            setIsLanguagesMenuOpen(false);
                        }}>
                            {t("close")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
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
                            <MenuList>
                                <MenuItem icon={<ChatIcon />} onClick={() => { setIsLanguagesMenuOpen(true) }}>
                                    {t("languages")}
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </div>
            </div>
        </ChakraProvider>
    </>)
}