require('ts-node').register()

const task = process.argv[2]


switch (task) {
  case 'doc':
  case 'docs':
    require('./scripts/make-docs')
    break
  case 'lib':
    require('./scripts/make-lib')
    break
  case 'dev':
    require('./scripts/dev-play')
    break
  case 'site':
    require('./scripts/make-site')
    break
  case 'play':
    require('./playground/')
    break
  case 'test':
  case 'tests':
    require('./scripts/dev-tests')
    break
}
