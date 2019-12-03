import { test } from './ouput.shema'
import { A } from '../src'

test('plugins', async ({ plan, ok, end, pass, fail, equal }) => {
  // const aFlow = A(async () => new Promise(done => setTimeout(() => done(10), 100)))
  const aFlow = A()
  aFlow.useGetter(
    async () =>
      new Promise(done =>
        setTimeout(() => {
          pass('mix1')
          done(10)
        }, 100),
      ),
  )
  const bFlow = A(5)
  const cFlow = A()
  await cFlow.from(aFlow, bFlow).holistic((a, b) => {
    return (a + b) as any
  })
  equal(await cFlow(), 15)
  const xFlow = A()

  xFlow.from(bFlow).holistic(async b => {
    pass('mix2')
    return new Promise(done => setTimeout(() => done(10), 100))
  })
  equal(await xFlow(), 10)
  plan(6)
  end()
})
