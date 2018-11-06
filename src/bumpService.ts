import { readFileSync, writeFileSync, unlinkSync, renameSync } from 'fs'
import { promisify } from 'util'
import { exec as execCallback } from 'child_process'
import chalk from 'chalk'

const exec = promisify(execCallback)
const fmtVersion = chalk.cyan.underline
const tick = chalk.green('✔')
const cross = chalk.red('✖')

export const imageTagRegex = (service: string) =>
  new RegExp(`${service}:\\n[\\s\\S]+?image: .+:(.*)`)

const defaultArgs = {
  file: 'docker-compose.yml',
  emoji: ':cloud:',
  push: false
}

/** Gets the version of a service in a docker-compose.yml file */
export function getServiceVersion(
  serviceName: string,
  { file, emoji, push } = defaultArgs
) {
  try {
    let [dc, _, version] = getService(file, serviceName)
    console.log(chalk(serviceName + ':'), fmtVersion(version))
  } catch (error) {
    console.log(chalk.red('error:'), error.message)
  }
}

/** Bump a docker-compose service to a new version & commit to a git repo */
export async function bumpService(
  serviceName: string,
  newVersion: string,
  { file, emoji, push } = defaultArgs
) {
  try {
    let [dc, tagRegex, version] = getService(file, serviceName)

    // Fail if the new version is the same as the old one
    if (newVersion === version) {
      throw new Error(`Version didn't change`)
    }

    // Replace the tag & re-write the file
    dc = dc.replace(tagRegex, (str, tag) => str.replace(tag, newVersion))
    writeFileWithTmp(file, dc)
    console.log(tick, `Bumped ${serviceName} to`, fmtVersion(newVersion))

    // Stage changes
    await exec(`git add ${file}`)
    console.log(tick, `Staged '${file}'`)

    // Commit to git
    await exec(
      `git commit -m '${emoji} Upgraded ${serviceName} to ${newVersion}'`
    )
    console.log(tick, `Commited '${file}'`)

    // Optionally push
    if (push) {
      await exec(`git push`)
      console.log(tick, `Pushed to default upstream`)
    }
  } catch (error) {
    console.log(cross, error.message)
  }
}

/** Gets the version  of a service in a docker-compose file */
export function getService(
  file: string,
  serviceName: string
): [string, RegExp, string] {
  let dc = loadDockerComposeFile(file)

  // Create a regex to find the tag
  let tagRegex = imageTagRegex(serviceName)
  let match = dc.match(tagRegex)

  // Fail if there was no match
  if (!match) {
    throw new Error(`Cannot find service '${serviceName}' in '${file}'`)
  }

  // Return the file, regex and matched version
  return [dc, tagRegex, match[1]]
}

/** Load a file as a string or fail */
export function loadDockerComposeFile(filepath: string): string {
  try {
    return readFileSync(filepath).toString('utf8')
  } catch (error) {
    throw new Error(`Cannot find '${filepath}'`)
  }
}

/** Writes a file to a path, using a tmp file incase it fails during the write */
export function writeFileWithTmp(filepath: string, fileData: string) {
  try {
    let tmpPath = filepath + '.tmp'

    renameSync(filepath, tmpPath)
    writeFileSync(filepath, fileData)
    unlinkSync(tmpPath)
  } catch (error) {
    console.log(error)
  }
}
