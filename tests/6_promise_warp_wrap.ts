import { test } from './ouput.shema'
import { A } from '../src'
import { FlowState } from '../src/FlowState'

test('promise, getter, wrapper', async ({ plan, ok, end, pass, fail, equal }) => {
  const testValue = 'testValue'
  const flow = A.flow()

  const asyncWait = () =>
    new Promise(done =>
      setTimeout(() => {
        done(testValue)
      }, 200),
    )

  flow.on.await(v=>{
    pass("promise await state:"+ v)
  })
  await flow(asyncWait())
  ok(flow.is(testValue), 'promise')


  flow.clear()

  flow.useGetter(() => testValue)
  ok(flow() == testValue, 'activate getter')
  ok(flow.value === testValue, 'getter value')


  flow.useGetter(asyncWait)
  flow(0)
  flow.on.await(isWait => {
    if (isWait) equal(flow.value, 0, 'About State Event: on.await ( is loading )')
    else equal(flow.value, testValue, 'About State Event: on.await ( is loaded )')
  })
  flow.on(FlowState.READY, () => equal(flow.value, testValue, "About State Event: ready"))
  equal(flow.value, 0, 'rewrite async warp')
  let value = await flow()

  ok(value == flow.value && value == testValue, 'consistency warped')


  flow.clear()
  const neverWait = () => fail("off")
  flow.on.await(neverWait)
  flow.off.await(neverWait)
  flow()

  plan(10)
  end()
})
