import { test } from './ouput.shema'
import { A } from '../src'

test('plugins', async ({ plan, ok, end, pass, fail, equal }) => {
  // const aFlow = A(async () => new Promise(done => setTimeout(() => done(10), 100)))
  const aFlow = A()
  aFlow.useGetter(
    async () =>
      new Promise(done =>
        setTimeout(() => {
          console.log('get')
          done(10)
        }, 100),
      ),
  )
  const bFlow = A(5)
  const cFlow = A()

  await cFlow.from(aFlow, bFlow).holistic((a: any, b) => {
    return (a + b) as any
  })

  console.log(await cFlow())
  end()
})
