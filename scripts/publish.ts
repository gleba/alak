import { lib } from './make-lib'
import { readFileSync, readSync, writeFileSync } from 'fs'
import { executeCommand } from './helpers'
import { clearLib } from './tsc'

function pumpVersion() {
  const packageJSON = JSON.parse(readFileSync('./package.json', 'utf-8'))
  const versionParts = packageJSON.version.split('.')
  versionParts.push(parseInt(versionParts.pop()) + 1)
  packageJSON.version = versionParts.join('.')
  writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2))
}

async function publish() {
  await lib()
  pumpVersion()
  await executeCommand('npm publish')
  clearLib()
}

publish()
