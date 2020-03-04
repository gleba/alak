// import A from '../packages/core'
import { Tick, timers } from 'exectimer'
import chalk from 'chalk'
import A from '../packages/facade'

const log = console.log
const unknownResult = (...text) => log(chalk.green(text.shift() + ':\t'), chalk.yellow(...text))
const memUsage = (...text) => log(chalk.yellow(text.shift() + ':\t'), chalk.yellow(...text))
const knownResult = (...text) => log(chalk.green(text.shift() + ':\t'), chalk.greenBright(...text))
const delagResult = (...text) => log(chalk.gray(text.shift() + ':\t'), chalk.gray(...text))

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

function niceBytes(x) {
  let l = 0,
    n = parseInt(x, 10) || 0
  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]
}

try {
  global.gc()
  log('gc')
} catch (e) {
  log('`node --expose-gc`')
  process.exit()
}

const instancesCount = 240000

let memBefore = process.memoryUsage()

// let instancesList: AFlow<any>[] = []
let instancesList: any[] = []
let timeBefore = Date.now()
let i = instancesCount




let calls = 0
// const someHandler = (v)=>calls++

function someHandler() {
  return calls++
}




while (i--) {
  const a = A()
  a.up(someHandler)
  instancesList.push(a)
}

const memAfterCreate = process.memoryUsage()
log('\ncreate')
Object.keys(memAfterCreate).forEach(name => {
  memUsage(name, niceBytes(memAfterCreate[name] - memBefore[name]))
})
knownResult(`${instancesCount} instances at`, `${Date.now() - timeBefore}ms`)

global.gc()
memBefore = process.memoryUsage()

const promises = []
let iterations = 100
while (iterations--) {
  Tick.wrap(function myFunction(done) {
    instancesList.forEach(f => {
      f(0)
    })
    done()
  })
}
const memAfterAll = process.memoryUsage()
log('\ntest')
Object.keys(memAfterAll).forEach(name => {
  memUsage(name, niceBytes(memAfterAll[name] - memBefore[name]))
})

var results = timers.myFunction

delagResult(`min`, results.parse(results.min()))
delagResult(`max`, results.parse(results.max()))
delagResult(`mean`, results.parse(results.max()))
knownResult(`median`, results.parse(results.median()))
unknownResult('total', results.parse(results.duration()))

console.log({ calls })
