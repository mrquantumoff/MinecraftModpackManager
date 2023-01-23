import { invoke } from "@tauri-apps/api";
import { ask } from "@tauri-apps/api/dialog";
import { tempdir } from "@tauri-apps/api/os";
import React, { useState } from "react";
import { IInstallerProps, InstallerConfig, RefScheme } from "../../Interfaces";
import getMinecraftFolder from "../../tools/getMinecraftFolder";
import "./installer.css";
import { open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import { useTranslation } from "react-i18next";
import { Alert, AlertIcon, AlertTitle, Button, ButtonGroup, CircularProgress, CloseButton, Input, Modal, Popover, PopoverArrow, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger } from "@chakra-ui/react";
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
    const t = config.translate;
    setIsButtonEnabled(false);
    const selected = await open({
        multiple: false,
        directory: false,
        filters: [
            {
                name: t("modpackreferencefileext"),
                extensions: ["mcmodpackref", "mcmodpackref.json", "qntmdpck.json"],
            },
        ],
    });
    if (selected === null || Array.isArray(selected)) {
        setDownloadProgressElement(
            <>

                <Alert className="alert" status="error">
                    <AlertTitle>{t("noProperFile")}</AlertTitle>
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
                    <AlertTitle>t("installSuccess")</AlertTitle>
                    <AlertIcon />
                </Alert>

            );
        } catch (e: any) {
            if (e === "Modpack exists") {
                let res = await ask(t("modpackExists") ?? "Modpack exists, do you want to overwrite it? (this is a fallback message)", {
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
                                    {t("installSuccess")}
                                </AlertTitle>
                                <AlertIcon />
                            </Alert>

                        );
                    } catch (err: any) {
                        setDownloadProgressElement(

                            <Alert className="alert" status="error">
                                <AlertTitle>{t("installError")} ({err})</AlertTitle>
                                <AlertIcon />
                            </Alert>

                        );
                    }
                } else {
                    setDownloadProgressElement(

                        <Alert className="alert" status="error">
                            <AlertTitle>{t("installError")} ({e})</AlertTitle>
                            <AlertIcon />
                        </Alert>

                    );
                }
            } else {
                setDownloadProgressElement(

                    <Alert className="alert" status="error">
                        <AlertTitle>{t("installError")} ({e})</AlertTitle>
                        <AlertIcon />
                    </Alert>

                );
            }
        }
    }
    setIsButtonEnabled(true);
};

export default function NewInstaller(props: IInstallerProps) {

    const { t } = useTranslation();

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
                    <AlertTitle>t("installSuccess")</AlertTitle>
                    <AlertIcon />
                </Alert>

            );
        } catch (e: any) {
            if (e === "Modpack exists") {
                let res = await ask(t("modpackExists"), {
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
                                <AlertTitle>{t("installSuccess")}</AlertTitle>
                                <AlertIcon />
                            </Alert>

                        );
                    } catch (err: any) {
                        setInfo(

                            <Alert className="alert" status="error">
                                <AlertTitle>{t("installError")} ({err})</AlertTitle>
                                <AlertIcon />
                            </Alert>

                        );
                    }
                } else {
                    setInfo(

                        <Alert className="alert" status="error">
                            <AlertTitle>{t("installError")} ({e})</AlertTitle>
                            <AlertIcon />
                        </Alert>

                    );
                }
            } else {
                setInfo(

                    <Alert className="alert" status="error">
                        <AlertTitle>{t("installError")}({e})</AlertTitle>
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
            setIsButtonEnabled: setIsButtonEnabled,
            translate: t,
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
            <div className="InstallerDialogs">
                <Popover isOpen={isMainDialogOpen} onClose={() => { setIsMainDialogOpen(false) }}>
                    <PopoverTrigger>
                        <Button className="InstallerButton button" isDisabled={!isButtonEnabled} onClick={async () => { await install() }} rightIcon={<DownloadIcon></DownloadIcon>}>Install a modpack</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow></PopoverArrow>
                        <PopoverHeader>{t("installMetadataQuestion")}</PopoverHeader>
                        <PopoverFooter>
                            <ButtonGroup isAttached>
                                <Button colorScheme="telegram" onClick={ManualInstall} className="dialog-buttons">{t("manualInput")}</Button>
                                <Button colorScheme="orange" onClick={ReferenceInstall} className="dialog-buttons">{t("referenceFile")}</Button>
                            </ButtonGroup>
                        </PopoverFooter>
                    </PopoverContent>
                </Popover>
                <Modal isOpen={isSubDialogOpen} onClose={() => { }}>
                    <ModalOverlay></ModalOverlay>
                    <ModalContent>
                        <div className="closebutton-separator"></div>
                        <ModalHeader>{t("enterModpackMeta")}</ModalHeader>
                        <ModalBody>
                            {/* <br></br> */}
                            <Input placeholder={t("name") ?? "Name"} onChange={(event: any) => {
                                modpackName = event.target.value;
                            }}></Input>
                            <br />
                            <br />
                            <Input placeholder="URL" onChange={(event: any) => {
                                modpackUrl = event.target.value;
                            }} type="text"></Input>

                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={closeSubDialog}>{t("install")}</Button>
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


