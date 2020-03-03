import { executeCommand, info, prepare, rm } from './helpers'
import resolve from 'rollup-plugin-node-resolve'
import * as path from 'path'
import { copyFileSync, readFileSync, writeFileSync } from 'fs'
import { removeSync } from 'fs-extra'
import { fork } from 'child_process'
const { log } = console
const chalk = require('chalk')

import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { rollup } from 'rollup'

console.log({ commonjs })

const packUmd = (packName, outName) =>
  new Promise(done =>
    rollup({
      input: `${packName}/${outName}.js`,

      plugins: [
        terser(),
        commonjs({
          ignoreGlobal: true,
          sourceMap: false,
        }),
      ],
    }).then(build =>
      build
        .write({
          file: `./umd/${outName}.js`,
          format: 'umd',
          name: 'A',
        })
        .then(()=>{
          rm(`./umd/${outName}.d.ts`)
          done()
        }),
    ),
  )

export const tsc = async () => {
  info('compiling typescript packages...')
  rm('lib')
  const tsconfigPath = path.join('packages', 'tsconfig.json')
  const tsconfData = readFileSync('tsconfig.json', {
    encoding: 'UTF-8',
  })
  const tsconfig = JSON.parse(tsconfData)
  delete tsconfig.files
  delete tsconfig.include
  writeFileSync(tsconfigPath, JSON.stringify(tsconfig))
  await executeCommand(
    `node ${path.resolve('node_modules/typescript/lib/tsc')} -d --outDir ../`,
    path.resolve('packages'),
  )
  //
  // info('compiling typescript packages as UMD module...')
  // rm(tsconfigPath)
  // // tsconfig.compilerOptions.module = 'UMD'
  // tsconfig.compilerOptions.moduleResolution = "Node"
  // writeFileSync(tsconfigPath, JSON.stringify({compilerOptions:{
  //   "sourceMap": false,
  //   // "module": "umd",
  //   // "target": "es6",
  //   "removeComments": true,
  //   "moduleResolution": "Node"
  // }}))
  // await prepare('umd-ts')
  // await executeCommand(
  //   `node ${path.resolve('node_modules/typescript/lib/tsc')} --downlevelIteration --outDir ../umd-ts`,
  //   path.resolve('packages'),
  // )
  // // rm(tsconfigPath)
  info('rollup...')
  await packUmd('umd', 'alak')
  await packUmd('umd', 'alak.core')
  // packUmd('facade', 'alak')
  info('done')
}

// rollup(rolupConfing("facade", "alak"))
// executeCommand(`node ${path.resolve('node_modules/jest/bin/jest')}`, path.resolve('.'))

tsc()

// info('done')
