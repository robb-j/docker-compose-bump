"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const child_process_1 = require("child_process");
const chalk_1 = require("chalk");
const exec = util_1.promisify(child_process_1.exec);
const fmtVersion = chalk_1.default.cyan.underline;
const tick = chalk_1.default.green('✔');
const cross = chalk_1.default.red('✖');
exports.imageTagRegex = (service) => new RegExp(`${service}:\\n[\\s\\S]+?image: .+:(.*)`);
const defaultArgs = {
    file: 'docker-compose.yml',
    emoji: ':cloud:',
    push: false
};
/** Gets the version of a service in a docker-compose.yml file */
function getServiceVersion(serviceName, { file, emoji, push } = defaultArgs) {
    try {
        let [dc, _, version] = getService(file, serviceName);
        console.log(chalk_1.default(serviceName + ':'), fmtVersion(version));
    }
    catch (error) {
        console.log(chalk_1.default.red('error:'), error.message);
    }
}
exports.getServiceVersion = getServiceVersion;
/** Bump a docker-compose service to a new version & commit to a git repo */
async function bumpService(serviceName, newVersion, { file, emoji, push } = defaultArgs) {
    try {
        let [dc, tagRegex, version] = getService(file, serviceName);
        // Fail if the new version is the same as the old one
        if (newVersion === version) {
            throw new Error(`Version didn't change`);
        }
        // Replace the tag & re-write the file
        dc = dc.replace(tagRegex, (str, tag) => str.replace(tag, newVersion));
        writeFileWithTmp(file, dc);
        console.log(tick, `Bumped ${serviceName} to`, fmtVersion(newVersion));
        // Stage changes
        await exec(`git add ${file}`);
        console.log(tick, `Staged '${file}'`);
        // Commit to git
        await exec(`git commit -m '${emoji} Upgrade ${serviceName} to ${newVersion}'`);
        console.log(tick, `Commited '${file}'`);
        // Optionally push
        if (push) {
            await exec(`git push`);
            console.log(tick, `Pushed to default upstream`);
        }
    }
    catch (error) {
        console.log(cross, error.message);
    }
}
exports.bumpService = bumpService;
/** Gets the version  of a service in a docker-compose file */
function getService(file, serviceName) {
    let dc = loadDockerComposeFile(file);
    // Create a regex to find the tag
    let tagRegex = exports.imageTagRegex(serviceName);
    let match = dc.match(tagRegex);
    // Fail if there was no match
    if (!match) {
        throw new Error(`Cannot find service '${serviceName}' in '${file}'`);
    }
    // Return the file, regex and matched version
    return [dc, tagRegex, match[1]];
}
exports.getService = getService;
/** Load a file as a string or fail */
function loadDockerComposeFile(filepath) {
    try {
        return fs_1.readFileSync(filepath).toString('utf8');
    }
    catch (error) {
        throw new Error(`Cannot find '${filepath}'`);
    }
}
exports.loadDockerComposeFile = loadDockerComposeFile;
/** Writes a file to a path, using a tmp file incase it fails during the write */
function writeFileWithTmp(filepath, fileData) {
    try {
        let tmpPath = filepath + '.tmp';
        fs_1.renameSync(filepath, tmpPath);
        fs_1.writeFileSync(filepath, fileData);
        fs_1.unlinkSync(tmpPath);
    }
    catch (error) {
        console.log(error);
    }
}
exports.writeFileWithTmp = writeFileWithTmp;
