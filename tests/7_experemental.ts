// import { test } from './ouput.shema'
// import { A } from '../src'
// import { ASE } from '../src/ASE'
//
// test('born', async ({ plan, ok, end, pass, fail, equal }) => {
//   const initValue = 'initValue'
//   const flow = A.flow(() => initValue)
//   flow('a')
//   ok(flow.value == 'a')
//   ok(flow() === initValue)
//   ok(flow.value === initValue)
//
//   async function asyncWait() {
//     return new Promise(done =>
//       setTimeout(() => {
//         done(initValue)
//       }, 200),
//     )
//   }
//
//   flow.useWarp(asyncWait)
//   flow(0)
//   flow.on.await(isWait => {
//     if (isWait) equal(flow.value, 0)
//     else equal(flow.value, initValue)
//   })
//   flow.on(ASE.READY, () => equal(flow.value, initValue))
//
//   equal(flow.value, 0)
//   await flow()
//   equal(flow.value, initValue)
//   plan(8)
//   end()
// })
