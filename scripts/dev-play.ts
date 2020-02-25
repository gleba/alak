import { fork } from 'child_process'
import { tsc } from './make-lib'

var nodemon = require('nodemon')

nodemon({
  ext: 'ts',
  watch: ['playground', 'packages'],
})

const forked = []
const play = () => {
  while (forked.length) forked.pop().kill()
  console.clear()
  forked.push(fork('build.js', ['play']))
}

nodemon.on('start', play).on('restart', function(files) {
  console.log(files)
  play()
})
