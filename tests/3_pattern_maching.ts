import {test} from './ouput.shema'
import {A} from '../src'

test('pattern matching', ({ plan, ok, end, pass, fail }) => {
  // basic
  const flow = A.flow(3)
  // prettier-ignore
  flow.match(
    3, v => ok(3 === v, "matching by key"),
    Array.isArray, ()=> pass("matching by type"),
    "never", _ => fail("silent pattern matching *", _),
     _ => pass("else "+ _)
  )

  flow(1)
  flow('8')
  flow([0])

  // advanced
  flow.clear()
  let state = [5, true, 'x']
  // prettier-ignore
  const isString = v => typeof v== 'string'
  flow.match(
    state, v => pass('match linked object'),
    [5, true, "x"], v => pass('match similar object'),
    isString, v => pass('match string', v),
    5, fail,
    [5], fail,
    (...v) => fail('else matched '+ v),
  )

  flow(state)
  flow([5, true, 'x'])

  flow.clear()

  flow.match(([a, b, c]) => [
    typeof a == "string" && b, v => pass(v),
    a && b && !c, v => pass(v),
    !b && c, v => pass(v),
    v => fail(v),
  ])

  flow(['A', false, true])
  flow([true, true, false])
  flow(['A', true])

  plan(10)
  end()
})
