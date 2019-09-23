import {test} from './ouput.shema'
import {A} from '../src'

test('sugar', ({ ok, end, plan }) => {
  let flow = A.flow()

  flow.upSome(v => ok(v != undefined && v != null, 'upSome ' + v))
  flow.upTrue(v => ok(!!v, 'upTrue ' + v))
  flow.upNone(v => ok(!v, 'upNone ' + v))
  flow(false)
  flow('hello')
  flow(null)
  flow(undefined)

  plan(5)
  end()
})
