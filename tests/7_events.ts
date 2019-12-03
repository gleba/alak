import { test } from './ouput.shema'
import { A } from '../src'

test('plugins', async ({ plan, ok, end, pass, fail, equal }) => {
  const testValue = 'testValue'
  const flow = A()

  const asyncWait = () =>
    new Promise(done =>
      setTimeout(() => {
        done(testValue)
      }, 200),
    )

  flow.useGetter(asyncWait)
  flow(0)
  flow.on.await(isWait => {
    if (isWait) equal(flow.value, 0, 'Async State : on.await ( is loading )')
    else equal(flow.value, testValue, 'Async State : on.await ( is loaded )')
  })
  flow.on(A.STATE_READY, () => equal(flow.value, testValue, 'Async State : ready'))
  equal(flow.value, 0, 'rewrite async warp')
  let value = await flow()

  ok(value == flow.value && value == testValue, 'consistency warped')

  const f1 = A()
  const f2 = A()
  flow.setId('10')
  flow.up(f1)
  // newFlow.up(f1)
  flow.up(f2)
  flow(2)

  flow.clear()
  const neverWait = () => fail('off')
  flow.on.await(neverWait)
  flow.off.await(neverWait)
  flow()

  end()
})
