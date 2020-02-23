import { test } from './ouput.shema'
import A from '../../packages/facade'

test('promise, getter, wrapper', async ({ plan, ok, end, pass, fail, equal }) => {

  const testValue = 10
  const flow = A()

  ok(!flow.isAsync, 'is Async false')
  const asyncWait = () => {
    console.log("asyncWait")
    return new Promise<number>(done =>
      setTimeout(() => {
        done(testValue)
      }, 200),
    )
  }
  flow.onAwait(s => {
    pass('promise await state:' + s)
  })
  console.log("isAsync", flow.isAsync)
  flow.useGetter(asyncWait)
  flow()
  console.log("isAsync", flow.isAsync)
  console.log("isAsync", flow.value)
  console.log(flow.isAwaiting)
  await flow()
  console.log(flow.value)
  console.log(flow.isAwaiting)


  // flow.useGetter(()=>true)
  // console.log("isAsync", flow.isAsync)
  // console.log(flow(), flow.isAsync)

  // ok(flow.isEmpty, 'promise is empty')

  // ok(flow.is(testValue), 'promise')
  //
  // flow.clear()
  // //
  // flow.useGetter(() => testValue)
  // console.log(flow())
  // console.log(flow())

  // ok(flow() === testValue, 'activate getter')
  // // ok(flow.value === testValue, 'match getter')
  // flow.clear()
  //
  // flow.onAwait( s => {
  //   pass('async getter await state:' + s)
  // })
  // flow.useGetter(asyncWait)
  // ok(flow.isAsync, 'is Async true')
  //
  // await flow()
  // ok(flow.value === testValue, 'async getter')
  //
  // flow.useWrapper((newV, preV) => {
  //   return newV * 2
  // })
  // flow(testValue)
  // flow(testValue)
  // ok(flow.value === testValue * 2, 'match wrapper')
  //
  // flow.clear()
  // flow.onAwait( s => {
  //   pass('async wrapper await state:' + s)
  // })
  // flow.up(v => ok(v === testValue * 3, 'match wrapper'))
  // flow.useWrapper(v => new Promise(done => done(v * 3)))
  // await flow(testValue)
  // plan(14)
  end()
})
