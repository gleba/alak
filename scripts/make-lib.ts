import { executeCommand, info, prepare, rm } from './helpers'

import * as path from 'path'
import { copyFileSync, readFileSync, writeFileSync } from 'fs'
import { removeSync } from 'fs-extra'
import { fork } from 'child_process'
const { log } = console
const chalk = require('chalk')

import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { rollup } from 'rollup'
import { tsc } from './tsc'

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

async function lib(){
  await tsc()
  await packUmd('umd', 'alak')
  await packUmd('umd', 'alak.core')
  info('done')
}
lib()
// rollup(rolupConfing("facade", "alak"))
// executeCommand(`node ${path.resolve('node_modules/jest/bin/jest')}`, path.resolve('.'))

// info('done')
