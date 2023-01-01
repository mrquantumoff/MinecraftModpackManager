import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import getMinecraftFolder from "../../tools/getMinecraftFolder";
import "./Selector.css";
import { platform } from "@tauri-apps/api/os";
import { checkUpdate, installUpdate, } from "@tauri-apps/api/updater";
import { relaunch, exit } from "@tauri-apps/api/process";
import { confirm } from "@tauri-apps/api/dialog";
import { IInstallerProps } from "../../Interfaces";

import { getVersion } from '@tauri-apps/api/app';
import { Button, ButtonGroup, ChakraProvider, CircularProgress, Container, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Portal, Select } from "@chakra-ui/react";
import {
  Alert,
  AlertTitle
} from '@chakra-ui/react'
import { CheckIcon, ChevronDownIcon, CloseIcon, DeleteIcon, RepeatIcon } from "@chakra-ui/icons";


export default function Selector(props: IInstallerProps) {

  const [options, setOptions] = useState(["No options"]);
  const isAutoCompleteActive = props.isButtonEnabled;
  const setIsAutoCompleteActive = props.setIsButtonEnabled;
  const [progress, setProgress] = useState<any>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const openModpack = async () => {
    const mcFolder = await getMinecraftFolder();
    await invoke("open_modpacks_folder", { minecraftfolder: mcFolder });
  };

  const [openModpackFolder, setOpenModpackFolder] = useState<any>(
    <ChakraProvider>
      <Button
        variant="solid"
        isDisabled={!isAutoCompleteActive}
        onClick={openModpack}>
        Open modpacks folder
      </Button>
    </ChakraProvider>
  );

  // Set mods folder free
  const setModsFree = async () => {
    setIsPopoverOpen(false);
    const mcFolder = await getMinecraftFolder();
    const os = await platform();
    setIsAutoCompleteActive(false);
    setProgress(<ChakraProvider> <CircularProgress isIndeterminate={true} /></ChakraProvider >);
    try {
      await invoke("clear_modpack", { minecraftfolder: mcFolder });
      setIsAutoCompleteActive(true);
      setProgress(
        <ChakraProvider ><Alert status="success"><AlertTitle>Modpack cleared successfully</AlertTitle></Alert></ChakraProvider>
      );
    } catch (err) {
      console.error(err);
      if (os === "win32") {
        setProgress(
          <ChakraProvider ><Alert status="error">
            <AlertTitle>Failed to clear modpacks, try running the app as admin</AlertTitle>
          </Alert></ChakraProvider >
        );
      } else {
        setProgress(
          <ChakraProvider >
            <Alert status="error">
              <AlertTitle>Failed to clear modpacks</AlertTitle>
            </Alert>
          </ChakraProvider >);
      }
      setIsAutoCompleteActive(true);
    }
  };

  const applyModpack = async () => {
    setIsPopoverOpen(false);
    const os = await platform();
    try {
      setIsAutoCompleteActive(false);
      setProgress(<ChakraProvider > <CircularProgress isIndeterminate={true} /></ChakraProvider >);
      const mcFolder = await getMinecraftFolder();
      if (autoCompleteValue === null) {
        setProgress(
          <ChakraProvider >
            <Alert status="warning">
              <AlertTitle>Please choose a modpack or set mods free by clearing the modpack</AlertTitle>
            </Alert>
          </ChakraProvider >
        );
      } else {
        await invoke("set_modpack", {
          minecraftfolder: mcFolder,
          modpack: autoCompleteValue,
        });
      }
      setIsAutoCompleteActive(true);
      setProgress(<ChakraProvider ><Alert status="success">
        <AlertTitle>Modpack set successfully</AlertTitle></Alert></ChakraProvider >);
    } catch (err) {
      console.error(err);
      if (os == "win32") {
        setProgress(
          <ChakraProvider >
            <Alert status="error">
              <AlertTitle>Failed to clear modpacks, try running the app as admin</AlertTitle>
            </Alert>
          </ChakraProvider >
        );
      } else {
        setProgress(<ChakraProvider ><Alert status="error">Failed to clear modpacks</Alert></ChakraProvider>);
      }
      setIsAutoCompleteActive(true);
    }
  };



  // Gets options from the backend
  const func = async () => {
    setIsPopoverOpen(false);
    const os = await platform();
    try {
      if (os === "darwin") {
        setOpenModpackFolder(null);
      }

      const update = await checkUpdate();
      const appVersion = await getVersion();
      if (update.shouldUpdate) {
        if (os === "darwin" || os === "win32") {
          setIsAutoCompleteActive(false);
          setProgress(
            <>
              <ChakraProvider>
                <Alert status="info">
                  <AlertTitle>Updating modpack manager...</AlertTitle>
                </Alert>
                <br></br>
                <CircularProgress isIndeterminate={true} />
              </ChakraProvider >
            </>
          );

          await installUpdate();
          // install complete, restart app
          await relaunch();
        }
        else {
          const up = async () => {
            try {
              setIsAutoCompleteActive(false);
              await installUpdate()
              await relaunch();
            }
            catch (error: any) {
              setIsAutoCompleteActive(true);
              setProgress(<ChakraProvider><Alert status="warning">
                <AlertTitle>Error while updating,this is common for flatpak. In case you are not running flatpak consider reading the error message ({error})</AlertTitle>
              </Alert></ChakraProvider>);
            }
          };
          setProgress(<>
            <ChakraProvider>
              <Alert status="info"><AlertTitle>There might be an update available ({appVersion} to {update.manifest?.version}), since you're running GNU+Linux the app has no idea whether it can update itself or not, the only way to find out is to try, do you wish to try?</AlertTitle></Alert>
              <Button onClick={up}>Try to update</Button>
            </ChakraProvider>
          </>)
        }
      }

    } catch (error: any) {
      if (os === "linux") {
        setIsAutoCompleteActive(true);
        setProgress(<ChakraProvider ><Alert status="info"><AlertTitle>Error while updating, this is common for flatpak. In case you are not running flatpak consider reading the error message ({error})</AlertTitle></Alert></ChakraProvider>);
      }
      else {
        setProgress(<ChakraProvider ><Alert status="error"><AlertTitle>{error}</AlertTitle></Alert></ChakraProvider>);
      }
      console.log(error);
    }

    const mcFolder = await getMinecraftFolder();

    try {
      const areModsSymlinks: boolean = await invoke("are_mods_symlinks", {
        minecraftfolder: mcFolder,
      });
      if (areModsSymlinks) {
        const confirmed = await confirm(
          "Warning: it seems that your mods aren't symlinked to the modpacks directory, this means any action (clear/apply) will result deleting your currently installed mods",
          "Data loss warning"
        );
        if (!confirmed) {
          exit(1);
        }
      }
    } catch (error: any) {
      console.error(error);
    }

    try {
      const res: string[] = await invoke("get_modpack_options", {
        minecraftfolder: mcFolder,
      });
      setOptions(res);
    } catch (err) {
      console.error(err);
      setOptions(["Failed to get modpack options (" + err + ")"]);
    }
  };

  useEffect(() => {
    func.call({});
  }, []);

  const [autoCompleteValue, setAutoCompleteValue] = useState<string | null>(
    null
  );

  useEffect(() => { console.log(autoCompleteValue) }, [autoCompleteValue]);

  return (
    <>
      <ChakraProvider>
        <div className="selector">
          <Select
            id="selectorAutocomplete"
            sx={{ width: 290 }}
            isDisabled={!isAutoCompleteActive}
            onChange={(value: any) => setAutoCompleteValue(value.target.value)}
          >
            {options.map((possibleOption) => {
              return <option key={possibleOption}>{possibleOption}</option>
            })}

          </Select>
        </div>
        <div className="buttons">
          <Popover
            isOpen={isPopoverOpen}>
            <PopoverTrigger>
              <Button onClick={() => { setIsPopoverOpen(true); }} rightIcon={<ChevronDownIcon />}>
                Actions
              </Button>
            </PopoverTrigger>
            <PopoverContent width={"110%"}>
              <PopoverArrow />
              <PopoverCloseButton onClick={() => {
                setIsPopoverOpen(false);
              }} />
              <PopoverBody>
                <ButtonGroup isAttached>
                  <Button disabled={autoCompleteValue === null} color="green.500" onClick={applyModpack} rightIcon={<CheckIcon />}>
                    Apply
                  </Button>
                  <Button onClick={setModsFree} color="red.500" rightIcon={<DeleteIcon />}>Clear</Button>
                  <Button onClick={func} color="blue.500" rightIcon={<RepeatIcon />}>Reload</Button>
                </ButtonGroup>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
        {progress}
        <div className="progress-separator"></div>
        {openModpackFolder}
      </ChakraProvider>
    </>
  );
}
