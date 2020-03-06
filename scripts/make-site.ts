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
import { mkdirSync, readdirSync, readFileSync, readSync, renameSync, rmdirSync, unlinkSync, writeFileSync } from 'fs'
import { info, log0, rm, prepare, executeCommand } from './helpers'
import { tsc } from './tsc'
const chalk = require('chalk')
const { log } = console



const homeDir = path.resolve('.')

// const regex = /\##.*?\n/;
const titleCode = /\##.*/;


const dinoTitle = (title, id) => `---
id: ${id}
title: ${title}
---
`
async function make() {

  info('making documentation...')
  // log0('cleaning working directory')
  const docDir = path.join(homeDir, 'docs')
  const siteDir = path.join(homeDir, 'my-website', 'docs', 'api')
  if (!existsSync('docs')) mkdirSync('docs')
  readdirSync(docDir).forEach(f=>{
    let mdStr = readFileSync(path.join(docDir, f), {
       encoding:"Utf8"
    })
    const title = titleCode.exec(mdStr)[0].slice(3)
    mdStr = mdStr.replace(/<code>/g, "`")
    mdStr = mdStr.replace(/<\/code>/g, "`")
    const mdOut = dinoTitle(title, f.replace(".md", ""))

    writeFileSync(path.join(siteDir, f), mdOut + mdStr)
    console.log(path.join(siteDir, f))

  })

  info('documentation ready')
}
make()
