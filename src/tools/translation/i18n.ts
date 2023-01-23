import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";

// Some flatpak related messages are not translated, because I don't want to accidentally lose the meaning of those messages
i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        resources: {
            en:{
                translation: {
                    // Global
                    name: "Name",
                    apply: "Apply",
                    clear: "Clear",
                    reload: "Reload",
                    openModpacksFolder: "Open modpacks folder",
                    // Heading
                    heading: "Minecraft Modpack Manager",
                    actions: "Actions",
                    modpackreferencefileext: "Modpack reference",
                    // Installer
                    installMetadataQuestion: "How would you like to enter your modpack metadata?",
                    manualInput: "Manual Input",
                    referenceFile: "Reference file",
                    enterModpackMeta: "Please enter your modpack metadata",
                    install: "Install",
                    installError: "Error while installing modpack",
                    installSuccess: "Modpack successfully installed",
                    noProperFile: "No proper file was selected.",
                    modpackExists: "Modpack exists, do you want to overwrite it?",
                    // Selector
                    modpackClearedSuccess: "Mods folder has been cleared successfully",
                    failedToClearModpacks: "Failed to clear modpacks (you can also try removing the mods folder)",
                    failedToApplyModpacks: "Failed to apply the modpack (you can also try removing the mods folder)",
                    tryAsAdmin: "try running the app as admin",
                    freeOrApply: "Please choose a modpack or set mods free by clearing the modpack",
                    modpackSetSuccess: "Modpack set successfully",
                    notSymlinkedMods: "Warning: it seems that your mods aren't symlinked to the modpacks directory, this means any action (clear/apply) will result deleting your currently installed mods",
                    dataLossWarning: "Data loss warning",
                    failedToGetOptions: "Failed to get modpack options",
                    // Other
                    updating: "Updating modpack manager",
                    flatpakError: "Error while updating,this is common for flatpak. In case you are not running flatpak consider reading the error message"
                }
            }
        }
    })
    ;