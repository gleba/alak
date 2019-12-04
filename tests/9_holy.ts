import { test } from './ouput.shema'
import { A } from '../src'
import { aFromFlows } from '../src/aFrom'

test('plugins', async ({ plan, ok, end, pass, fail, equal }) => {
  let timeout = 1
  let i = 1
  const aFlow = A(async () => new Promise(done => setTimeout(() => done(i++), timeout)))
  const bFlow = A(async () => new Promise(done => setTimeout(() => done(i++), timeout + 10)))

  const cFlow = A()
  await cFlow.from(aFlow, bFlow).holistic((a: any, b: any) => {
    pass('mix')
    return (a + b) as any
  })

  timeout = 100
  bFlow()
  aFlow()

  equal(cFlow(), 3)
  plan(3)
  setTimeout(end, 150)
})
