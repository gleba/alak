import { rmdir, existsSync } from 'fs-extra'
import * as path from 'path'
import { exec, execSync } from 'child_process'
import { renameSync, rmdirSync } from 'fs'
const chalk = require('chalk')
const { log } = console

const executeCommand = (command, cwd) =>
  new Promise(async done => {
    exec(command, { cwd: cwd }, (error, stdout) => {
      // if (error) log(chalk.redBright(error))
      log(stdout)
      log(chalk.grey('done '), chalk.gray(command))
      done()
    })
  })

// prettier-ignore
// @ts-ignore
const clearDir = name => new Promise(async done => rmdir(path.resolve(name), { recursive: true }, done))
const rm = name => rmdirSync(name, {
  recursive:true
})
const homeDir = path.resolve('.')
async function extract(command, arg) {
  const pathParts = command.split('/')
  const moduleName = `${pathParts[1]}/${pathParts[2]}`
  const apiExtractorPath = path.resolve(path.join(...pathParts))
  const run = async () => {
    log(chalk.gray("run "), moduleName)
    await executeCommand(`node ${apiExtractorPath} ${arg}`, homeDir)
  }
  if (existsSync(apiExtractorPath)) {
    await run()
  } else {
    log(chalk.grey("installing module"), moduleName)
    await executeCommand(`npm i ${moduleName} --no-save`, homeDir)
    await run()
  }
}

const info = text => log(chalk.green.bold(text))
log('make documentation')
clearDir('lib').then(async () => {
  // info('compiling typescript packages')
  // await executeCommand(
  //   `node ${path.resolve('node_modules/typescript/lib/tsc')}`,
  //   path.resolve('packages'),
  // )
  info("extract api")
  await extract('node_modules/@microsoft/api-extractor/lib/start.js', 'run')
  info("make markdown")
  await extract('node_modules/@microsoft/api-documenter/lib/start.js', 'markdown')
  rm('docs')
  renameSync('markdown', 'docs')
  rm('input')
})
