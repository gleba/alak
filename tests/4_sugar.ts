import {test} from './ouput.shema'
import {A} from '../src'

test('sugar', ({ok, end, plan}) => {
  let flow = A()

  flow.upSome(v => ok(v != undefined && v != null, 'upSome ' + v))
  flow.upTrue(v => ok(!!v, 'upTrue ' + v))
  flow.upNone(v => ok(!v, 'upNone ' + v))
  flow(false)
  flow('hello')
  flow(null)
  flow(undefined)


  let f1 = A.dict(Array(10).fill(0).reduce((p, v, i) => {
    p["x" + i] = {
      id: i,
      x: Math.random()
    }
    return p
  }, {}))


  plan(5)
  end()
})

