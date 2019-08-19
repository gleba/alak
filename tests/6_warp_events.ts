import { test } from './ouput.shema'
import { A } from '../src'
import { ASE } from '../src/ASE'

test('warp and ', async ({ plan, ok, end, pass, fail, equal }) => {
  const initValue = 'initValue'
  const flow = A.flow(() => initValue)
  flow('a')
  ok(flow.value == 'a', 'rewrite warp ')
  ok(flow() === initValue, 'warp')
  ok(flow.value === initValue, 'warp value')

  async function asyncWait() {
    return new Promise(done =>
      setTimeout(() => {
        done(initValue)
      }, 200),
    )
  }

  flow.useWarp(asyncWait)
  flow(0)
  flow.on.await(isWait => {
    if (isWait) equal(flow.value, 0, 'About State Event: on.await ( is loading )')
    else equal(flow.value, initValue, 'About State Event: on.await ( is loaded )')
  })
  flow.on(ASE.READY, () => equal(flow.value, initValue, "About State Event: ready"))

  equal(flow.value, 0, 'rewrite async warp')
  let value = await flow()
  ok(value == flow.value && value == initValue, 'values consistency')
  plan(8)
  end()
})
