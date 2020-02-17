import { test } from './ouput.shema'
import { A } from '../packages/core'
import { FState } from '../packages/core/state'

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
  flow.onAwait(isWait => {
    if (isWait) equal(flow.value, 0, 'Async State : on.await ( is loading )')
    else equal(flow.value, testValue, 'Async State : on.await ( is loaded )')
  })

  equal(flow.value, 0, 'rewrite async warp')
  let value = await flow()
  //
  ok(value == flow.value && value == testValue, 'consistency warped')

  const f1 = A()
  const f2 = A()
  flow.setId('10')
  flow.up(f1)
  flow.up(f2)
  flow(2)

  flow.clear()
  const neverWait = () => fail('off')
  flow.onAwait(neverWait)
  flow.offAwait(neverWait)
  flow()
  plan(4)
  end()
})
