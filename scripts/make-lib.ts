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
  rm(tsconfigPath)
  info('rollup...')
  await packUmd('umd', 'alak')
  await packUmd('umd', 'alak.core')
  info('done')
}

// rollup(rolupConfing("facade", "alak"))
// executeCommand(`node ${path.resolve('node_modules/jest/bin/jest')}`, path.resolve('.'))

tsc()

// info('done')
