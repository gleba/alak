import { fork } from 'child_process'
import { tsc } from './make-lib'

var nodemon = require('nodemon')

nodemon({
  ext: 'js',
  watch: 'tests',
})

const runTests = () => fork('node_modules/jest/bin/jest')

nodemon
  .on('start', () => tsc().then(runTests))
  .on('restart', function(files) {
    console.log('Tests restarted : ', files)
    fork('node_modules/jest/bin/jest')
  })
