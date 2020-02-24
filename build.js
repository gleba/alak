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
    require('./playground/ot')
    break
  case 'play':
    require('./playground/')
    break
  case 'tests':
    require('./scripts/dev-tests')
    break
  //default:
  //  require('./scripts/make-lib')
}
