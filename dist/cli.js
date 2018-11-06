#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bumpService_1 = require("./bumpService");
const program = require("commander");
let commandUsed = false;
program
    .version('0.1.0')
    .name('dc-bump')
    .description('A command to get or bump the version of a docker-compose service & commit the change')
    .arguments('<service> [version]')
    .option('-f, --file [path]', 'Specify where the docker-compose file is [docker-compose.yml]', 'docker-compose.yml')
    .option('-e, --emoji [emoji]', 'The emoji to prepend commits with [:cloud:]', ':cloud:')
    .option('-p, --push', 'Also do a git push')
    .action((service, version) => {
    commandUsed = true;
    if (version)
        bumpService_1.bumpService(service, version, program);
    else
        bumpService_1.getServiceVersion(service, program);
});
program.parse(process.argv);
if (!commandUsed) {
    program.outputHelp();
    process.exit(1);
}
