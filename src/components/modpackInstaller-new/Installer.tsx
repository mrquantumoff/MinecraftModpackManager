import { invoke } from "@tauri-apps/api";
import { ask } from "@tauri-apps/api/dialog";
import { tempdir } from "@tauri-apps/api/os";
import React, { useState } from "react";
import { IInstallerProps, InstallerConfig, RefScheme } from "../../Interfaces";
import getMinecraftFolder from "../../tools/getMinecraftFolder";
import "./installer.css";
import { open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import { Alert, AlertIcon, AlertTitle, Button, ChakraProvider, CircularProgress, Input, Modal } from "@chakra-ui/react";
import {
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { DownloadIcon } from "@chakra-ui/icons";

export const RefInstall = async (config: InstallerConfig) => {
    const setIsButtonEnabled = config.setIsButtonEnabled;
    const setDownloadProgressElement = config.setDownloadProgressElement;;

    setIsButtonEnabled(false);
    const selected = await open({
        multiple: false,
        directory: false,
        filters: [
            {
                name: "Modpack Reference",
                extensions: ["mcmodpackref", "mcmodpackref.json", "qntmdpck.json"],
            },
        ],
    });
    if (selected === null || Array.isArray(selected)) {
        setDownloadProgressElement(
            <>

                <Alert className="alert" status="error">
                    <AlertTitle>No proper file was selected.</AlertTitle>
                    <AlertIcon />
                </Alert>

            </>
        );
    } else {
        const conts = await readTextFile(selected);
        const reference: RefScheme = await JSON.parse(conts);
        setDownloadProgressElement(<><br></br><CircularProgress isIndeterminate={true}></CircularProgress></>);

        const tempdirPath = await tempdir();
        const mcFolder = await getMinecraftFolder();
        try {
            await invoke("install_mc_mods", {
                minecraftfolder: mcFolder,
                tempdir: tempdirPath,
                mdpckname: reference.name,
                downloadUrl: reference.downloadUrl,
                forceinstall: false,
            });
            setDownloadProgressElement(

                <Alert className="alert" status="success">
                    <AlertTitle>Modpack has been installed successfully</AlertTitle>
                    <AlertIcon />
                </Alert>

            );
        } catch (e: any) {
            if (e === "Modpack exists") {
                let res = await ask("Modpack exists, do you want to overwrite it?", {
                    title: "Minecraft modpack manager",
                });
                if (res === true) {
                    try {
                        await invoke("install_mc_mods", {
                            minecraftfolder: mcFolder,
                            tempdir: tempdirPath,
                            mdpckname: reference.name,
                            downloadUrl: reference.downloadUrl,
                            forceinstall: true,
                        });
                        setDownloadProgressElement(

                            <Alert className="alert" status="success">
                                <AlertTitle>
                                    Modpack has been installed successfully
                                </AlertTitle>
                                <AlertIcon />
                            </Alert>

                        );
                    } catch (err: any) {
                        setDownloadProgressElement(

                            <Alert className="alert" status="error">
                                <AlertTitle>Error while installing modpack ({err})</AlertTitle>
                                <AlertIcon />
                            </Alert>

                        );
                    }
                } else {
                    setDownloadProgressElement(

                        <Alert className="alert" status="error">
                            <AlertTitle>Error while installing modpack ({e})</AlertTitle>
                            <AlertIcon />
                        </Alert>

                    );
                }
            } else {
                setDownloadProgressElement(

                    <Alert className="alert" status="error">
                        <AlertTitle>Error while installing modpack ({e})</AlertTitle>
                        <AlertIcon />
                    </Alert>

                );
            }
        }
    }
    setIsButtonEnabled(true);
};

export default function NewInstaller(props: IInstallerProps) {


    // States that may vary
    const [isMainDialogOpen, setIsMainDialogOpen] = useState<boolean>(false);
    const [isSubDialogOpen, setIsSubDialogOpen] = useState<boolean>(false);

    let modpackName: string = ""
    let modpackUrl: string = ""

    // Self-explantory 
    const setIsButtonEnabled = props.setIsButtonEnabled;
    const isButtonEnabled = props.isButtonEnabled;


    // Info about state of the installation, dialogs
    const setInfo = props.setDownloadProgressElement;
    const info = props.downloadProgressElement;


    const ManualInstall = async () => {

        console.log("Manual Install");

        setIsSubDialogOpen(true);

        setIsMainDialogOpen(false);
    }

    const startMInstall = async () => {

        console.log("Installing")

        if (modpackName === "" || modpackUrl === "") {
            setIsButtonEnabled(true);
            return
        }

        // Install
        const tempdirPath = await tempdir();
        const mcFolder = await getMinecraftFolder();
        setInfo(<><br></br><CircularProgress isIndeterminate={true}></CircularProgress></>)
        try {
            await invoke("install_mc_mods", {
                minecraftfolder: mcFolder,
                tempdir: tempdirPath,
                mdpckname: modpackName,
                downloadUrl: modpackUrl,
                forceinstall: false,
            });
            setInfo(

                <Alert className="alert" status="success">
                    <AlertTitle>Modpack has been installed successfully</AlertTitle>
                    <AlertIcon />
                </Alert>

            );
        } catch (e: any) {
            if (e === "Modpack exists") {
                let res = await ask("Modpack exists, do you want to overwrite it?", {
                    title: "Minecraft modpack manager",
                });
                if (res === true) {
                    try {
                        await invoke("install_mc_mods", {
                            minecraftfolder: mcFolder,
                            tempdir: tempdirPath,
                            mdpckname: modpackName,
                            downloadUrl: modpackUrl,
                            forceinstall: true,
                        });
                        setInfo(

                            <Alert className="alert" status="success">
                                <AlertTitle>Modpack has been installed successfully</AlertTitle>
                                <AlertIcon />
                            </Alert>

                        );
                    } catch (err: any) {
                        setInfo(

                            <Alert className="alert" status="error">
                                <AlertTitle> Error while installing modpack ({err})</AlertTitle>
                                <AlertIcon />
                            </Alert>

                        );
                    }
                } else {
                    setInfo(

                        <Alert className="alert" status="error">
                            <AlertTitle> Error while installing modpack ({e})</AlertTitle>
                            <AlertIcon />
                        </Alert>

                    );
                }
            } else {
                setInfo(

                    <Alert className="alert" status="error">
                        <AlertTitle> Error while installing modpack ({e})</AlertTitle>
                        <AlertIcon />
                    </Alert>

                );
            }
        }
        setIsButtonEnabled(true);
    }

    const ReferenceInstall = async () => {
        setIsMainDialogOpen(false);
        await RefInstall({
            setDownloadProgressElement: setInfo,
            setIsButtonEnabled: setIsButtonEnabled
        })
    }

    const closeSubDialog = async () => {
        setIsSubDialogOpen(false);
        setIsButtonEnabled(false);
        await startMInstall();
    }

    const install = async () => {
        // setInfo(
        setIsMainDialogOpen(true);
    }
    return (
        <>

            <div className="newInstaller">
                <Button className="InstallerButton button" rightIcon={<DownloadIcon />} isDisabled={!isButtonEnabled} onClick={async () => { await install() }}>Install a modpack</Button>
            </div>

            <div className="InstallerDialogs">
                <Modal isOpen={isMainDialogOpen} onClose={() => { setIsMainDialogOpen(false) }}>
                    <ModalOverlay></ModalOverlay>

                    <ModalContent>
                        <ModalCloseButton onClick={() => {
                            setIsMainDialogOpen(false);
                        }}></ModalCloseButton>
                        <div className="closebutton-separator"></div>
                        <ModalHeader>How would you like to enter your modpack metadata?</ModalHeader>
                        <ModalFooter>

                            <Button colorScheme="telegram" onClick={ManualInstall} className="dialog-buttons">Manual Input</Button>
                            <Button colorScheme="orange" onClick={ReferenceInstall} className="dialog-buttons">Reference file</Button>

                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Modal isOpen={isSubDialogOpen} onClose={() => { }}>
                    <ModalOverlay></ModalOverlay>
                    <ModalContent>
                        <div className="closebutton-separator"></div>
                        <ModalHeader>Please enter your modpack metadata</ModalHeader>
                        <ModalBody>
                            {/* <br></br> */}
                            <Input placeholder="Name" onChange={(event: any) => {
                                modpackName = event.target.value;
                            }}></Input>
                            <br />
                            <br />
                            <Input placeholder="URL" onChange={(event: any) => {
                                modpackUrl = event.target.value;
                            }} type="text"></Input>

                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={closeSubDialog}>Install</Button>
                            <ModalCloseButton onClick={() => {
                                setIsSubDialogOpen(false);
                            }}></ModalCloseButton>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </div>

        </>
    )

}