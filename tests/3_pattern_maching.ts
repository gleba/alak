import { test } from './ouput.shema'
import { A, DFlow } from '../src'
import { isInteger } from 'core-js/fn/number'
import { isArray } from 'core-js/fn/array'

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
    (...v) => pass('else matched '+ v),
  )


  // prettier-ignore
  flow.match((a, b, c) => [
    Number.isInteger(b), () => pass('multi pattern function call'),
    a == 'A' && b == 1, (...v) => ok(v[2].length==2, 'multi matching'),
    a == state && !b && !c, () => pass('multi matching'),
    c == a, fail
  ])

  flow(state)
  flow([5, true, 'x'])
  // prettier-ignore
  flow('A', 1, [0, 1],)

  plan(10)
  end()
})
