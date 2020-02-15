import { test } from './ouput.shema'
import { A } from '../packages'

test('quantum', async ({ plan, ok, end, pass, fail, equal }) => {
  let timeout = 7
  let a = 1
  let b = 1

  const aFlow = A(() => new Promise(done => setTimeout(() => done(a++), timeout)))
  const bFlow = A(() => new Promise(done => setTimeout(() => done(b++), timeout + 10)))

  aFlow()
  bFlow()

  const qFlow = A()
  await qFlow.from(aFlow, bFlow).quantum(async (a: any, b) => {
    return a + b
  })

  aFlow()
  equal(await qFlow(), 3)
  plan(1)
  end()
})
