#!/usr/bin/env node
import { bumpService, getServiceVersion } from './bumpService'
import * as program from 'commander'

let commandUsed = false

program
  .version('0.1.0')
  .name('dc-bump')
  .description('A command to get or bump the version of a docker-compose service & commit the change')
  .arguments('<service> [version]')
  .option(
    '-f, --file [path]',
    'Specify where the docker-compose file is [docker-compose.yml]',
    'docker-compose.yml'
  )
  .option(
    '-e, --emoji [emoji]',
    'The emoji to prepend commits with [:cloud:]',
    ':cloud:'
  )
  .option('-p, --push', 'Also do a git push')
  .action((service: string, version?: string) => {
    commandUsed = true
    if (version) bumpService(service, version, program as any)
    else getServiceVersion(service, program as any)
  })

program.parse(process.argv)

if (!commandUsed) {
  program.outputHelp()
  process.exit(1)
}
