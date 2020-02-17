require('ts-node').register()

const task = process.argv[2]

switch (task) {
  case 'docs':
    require('./scripts/make-docs')
    break
  case 'lib':
    require('./scripts/make-lib')
    break
  case 'dev':
    require('./tests')
    break
  case 'play':
    require('./playground/benchmark')
    break
  //default:
  //  require('./scripts/make-lib')
}
