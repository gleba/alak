require('ts-node').register()

const task = process.argv[2]

switch (task) {
  case 'docs':
    require('./scripts/make-docs')
    break
  //case 'dev':
  //  require('./playground')
  //  break
  //default:
  //  require('./scripts/make-lib')
}
