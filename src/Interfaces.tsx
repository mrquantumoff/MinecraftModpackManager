export interface IInstallerProps {
    isButtonEnabled: boolean;
    setIsButtonEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    downloadProgressElement: any;
    setDownloadProgressElement: React.Dispatch<React.SetStateAction<any>>;
}
export interface RefScheme {
    downloadUrl: string;
    name: string;
}

export interface InstallerConfig {
    setIsButtonEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    setDownloadProgressElement: React.Dispatch<React.SetStateAction<any>>;
    translate: any;
}