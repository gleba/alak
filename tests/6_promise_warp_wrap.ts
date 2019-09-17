import { test } from './ouput.shema'
import { A } from '../src'
import { ASE } from '../src/ASE'

test('promise, getter, wrapper', async ({ plan, ok, end, pass, fail, equal }) => {
  const initValue = 'initValue'
  const flow = A.flow()

  flow.useGetter(() => initValue)
  flow('a')
  ok(flow.value == 'a', 'rewrite getter')
  ok(flow() == initValue, 'activate getter')
  ok(flow.value === initValue, 'getter value')


  // flow.use
  async function asyncWait() {
    return new Promise(done =>
      setTimeout(() => {
        done(initValue)
      }, 200),
    )
  }


  flow.useGetter(asyncWait)
  flow(0)
  flow.on.await(isWait => {
    if (isWait) equal(flow.value, 0, 'About State Event: on.await ( is loading )')
    else equal(flow.value, initValue, 'About State Event: on.await ( is loaded )')
  })
  flow.on(ASE.READY, () => equal(flow.value, initValue, "About State Event: ready"))
  equal(flow.value, 0, 'rewrite async warp')
  let value = await flow()

  ok(value == flow.value && value == initValue, 'consistency warped')


  flow.clear()
  const neverWait = () => fail("off")
  flow.on.await(neverWait)
  flow.off.await(neverWait)
  flow()

  plan(8)
  end()
})
