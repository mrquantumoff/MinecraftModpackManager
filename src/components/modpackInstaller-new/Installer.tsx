import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Input } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { ask } from "@tauri-apps/api/dialog";
import { tempdir } from "@tauri-apps/api/os";
import React, { useState } from "react";
import { IInstallerProps } from "../../Interfaces";
import getMinecraftFolder from "../../tools/getMinecraftFolder";
import { RefInstall } from "../modpackinstaller-legacy/installer";
import "./installer.css";

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
        setInfo(<CircularProgress></CircularProgress>)
        try {
            await invoke("install_mc_mods", {
                minecraftfolder: mcFolder,
                tempdir: tempdirPath,
                mdpckname: modpackName,
                downloadUrl: modpackUrl,
                forceinstall: false,
            });
            setInfo(
                <Alert className="alert" severity="success">
                    Modpack has been installed successfully
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
                            <Alert className="alert" severity="success">
                                Modpack has been installed successfully
                            </Alert>
                        );
                    } catch (err: any) {
                        setInfo(
                            <Alert className="alert" severity="error">
                                Error while installing modpack ({err})
                            </Alert>
                        );
                    }
                } else {
                    setInfo(
                        <Alert className="alert" severity="error">
                            Error while installing modpack ({e})
                        </Alert>
                    );
                }
            } else {
                setInfo(
                    <Alert className="alert" severity="error">
                        Error while installing modpack ({e})
                    </Alert>
                );
            }
        }
    }

    const ReferenceInstall = async () => {
        setIsMainDialogOpen(false);
        setInfo(<CircularProgress></CircularProgress>)
        await RefInstall({
            setDownloadProgressElement: setInfo,
            setIsButtonEnabled: setIsButtonEnabled
        })
    }

    const closeSubDialog = async () => {
        setIsSubDialogOpen(false);
        await startMInstall();
    }

    const install = async () => {
        // setInfo(
        setIsMainDialogOpen(true);
    }

    return (
        <>
            <div className="newInstaller">
                <Button className="InstallerButton" disabled={!isButtonEnabled} onClick={async () => { await install() }}>Install a modpack (beta)</Button>
            </div>

            <div className="InstallerDialogs">
                <Dialog open={isMainDialogOpen} onClose={() => { setIsMainDialogOpen(false) }}>
                    <DialogTitle>How would you like to enter your modpack metadata?</DialogTitle>
                    <DialogActions>
                        <Button onClick={ManualInstall}>Manual Input</Button>
                        <Button onClick={ReferenceInstall}>Reference file</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isSubDialogOpen}>
                    <DialogTitle>Please enter your modpack metadata</DialogTitle>
                    <DialogContent>
                        <Input fullWidth placeholder="Name" onChange={(event: any) => {
                            modpackName = event.target.value;
                        }}></Input>
                        <br />
                        <br />
                        <Input fullWidth placeholder="URL" onChange={(event: any) => {
                            modpackUrl = event.target.value;
                        }} type="text"></Input>
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={closeSubDialog}>Install</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )

}