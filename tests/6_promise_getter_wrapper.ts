import { test } from './ouput.shema'
import { A } from '../packages/core'

test('promise, getter, wrapper', async ({ plan, ok, end, pass, fail, equal }) => {
  const testValue = 10
  const flow = A()

  ok(!flow.isAsync, 'is Async false')
  const asyncWait = () =>
    new Promise(done =>
      setTimeout(() => {
        done(testValue)
      }, 200),
    )
  flow.on("await", s => {
    pass('promise await state:' + s)
  })
  await flow(asyncWait())
  ok(flow.is(testValue), 'promise')

  flow.clear()

  flow.useGetter(() => testValue)
  ok(flow() === testValue, 'activate getter')
  ok(flow.value === testValue, 'match getter')
  flow.clear()

  flow.on("await", s => {
    pass('async getter await state:' + s)
  })
  flow.useGetter(asyncWait)
  ok(flow.isAsync, 'is Async true')

  await flow()
  ok(flow.value === testValue, 'async getter')

  flow.useWrapper((newV, preV) => {
    return newV * 2
  })
  flow(testValue)
  flow(testValue)
  ok(flow.value === testValue * 2, 'match wrapper')

  flow.clear()
  flow.on('await', s => {
    pass('async wrapper await state:' + s)
  })
  flow.up(v => ok(v === testValue * 3, 'match wrapper'))
  flow.useWrapper(v => new Promise(done => done(v * 3)))
  await flow(testValue)
  plan(14)
  end()
})
