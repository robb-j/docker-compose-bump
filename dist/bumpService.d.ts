export declare const imageTagRegex: (service: string) => RegExp;
/** Gets the version of a service in a docker-compose.yml file */
export declare function getServiceVersion(serviceName: string, { file, emoji, push }?: {
    file: string;
    emoji: string;
    push: boolean;
}): void;
/** Bump a docker-compose service to a new version & commit to a git repo */
export declare function bumpService(serviceName: string, newVersion: string, { file, emoji, push }?: {
    file: string;
    emoji: string;
    push: boolean;
}): Promise<void>;
/** Gets the version  of a service in a docker-compose file */
export declare function getService(file: string, serviceName: string): [string, RegExp, string];
/** Load a file as a string or fail */
export declare function loadDockerComposeFile(filepath: string): string;
/** Writes a file to a path, using a tmp file incase it fails during the write */
export declare function writeFileWithTmp(filepath: string, fileData: string): void;
