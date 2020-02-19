import {
  rmdir,
  existsSync,
  mkdirpSync,
  readJSON,
  writeJSON,
  writeJSONSync,
  readJSONSync,
} from 'fs-extra'
import * as path from 'path'
import { exec, execSync, fork } from 'child_process'
import { mkdirSync, readdirSync, renameSync, rmdirSync, unlinkSync } from 'fs'
import { info, log0, rm, prepare, executeCommand } from './helpers'
import { tsc } from './make-lib'
const chalk = require('chalk')
const { log } = console



const dirName = 'TEMPleDocs'
const homeDir = path.resolve('.')
const workDir = path.resolve('TEMPleDocs')
const extractor = 'extractor'
const documenter = 'documenter'
const cfgFile = 'api-extractor.json'

const getModuleStartPath = name => `node_modules/@microsoft/api-${name}/lib/start.js`
async function checkModule(name) {
  const modulePath = getModuleStartPath(name)
  if (!existsSync(modulePath)) {
    info(`installing ${name}...`)
    await executeCommand(`npm i @microsoft/api-${name}`, homeDir)
  } else {
    log0(`${name} found`)
  }
}

async function extractApi(name) {
  const cwd = path.join(workDir, name)
  prepare(cwd)
  const config = readJSONSync(path.join(homeDir, 'scripts', cfgFile))
  const outFilePath = `../input/${name}.api.json`
  config.mainEntryPointFilePath = `../../lib/${name}/index.d.ts`
  config.docModel.apiJsonFilePath = outFilePath
  writeJSONSync(path.join(cwd, cfgFile), config)
  log0(`extract ${name} api..`)
  await executeCommand(`node ../../${getModuleStartPath(extractor)} run -c ${cfgFile}`, cwd)

  // config.mainEntryPointFilePath = path.join(cwd, 'dist', 'alak.d.ts')
  // config.docModel.apiJsonFilePath = outFilePath
  // writeJSONSync(path.join(cwd, cfgFile), config)
  // await executeCommand(`node ../../${getModuleStartPath(extractor)} run -c ${cfgFile}`, cwd)

  writeJSONSync(path.join(cwd, cfgFile), config)
  const api = readJSONSync(path.join(cwd, outFilePath))
  api.name = name
  writeJSONSync(path.join(cwd, outFilePath), api)
  log0(`api ready ` + name)
}

async function make() {
  await Promise.all([checkModule(extractor), checkModule(documenter), tsc()])
  info('extract api...')
  prepare(workDir)

  await Promise.all([extractApi('core'), extractApi('facade')])
  info('making documentation...')
  await Promise.all([
    executeCommand(`node ../${getModuleStartPath(documenter)} markdown`, workDir),
    executeCommand(`node ../${getModuleStartPath(documenter)} yaml`, workDir),
    ])
  log0('cleaning working directory')
  readdirSync('docs').forEach(f=>unlinkSync(path.join('docs',f)))
  const markDir = path.resolve(workDir, 'markdown')
  readdirSync(markDir).forEach(f=>renameSync(path.join(markDir, f), path.join('docs',f)))
  // rm(workDir)
  // info('documentation ready')
}
make()
