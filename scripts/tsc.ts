import { executeCommand, info, rm } from './helpers'
import path from 'path'
import { readFileSync, writeFileSync } from 'fs'

export function clearJs() {
  info('clear js...')
  rm('core')
  rm('facade')
  rm('ext-matching')
  rm('ext-computed')
  rm('debug')
}

export async function tsc() {
  clearJs()
  info('compiling typescript packages...')
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
}
