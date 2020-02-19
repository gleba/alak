//
// import { Atom, setAtomValue } from '../core/atom'
// import { isPromise } from '../core/utils'
// import { AFlow } from '../facade'
//
//
// type UnpackedPromise<T> = T extends Promise<infer U> ? U : T
// type UnpackedFlow<T> = T extends (...args: any[]) => infer U ? U : T
// type ReturnArrayTypes<T extends any[]> = { [K in keyof T]: UnpackedPromise<UnpackedFlow<T[K]>> }
// type FromHandler<T, A extends any[]> = {
//   (...a: ReturnArrayTypes<A>): T | PromiseLike<T>
// }
//  type FromFlowFn<T, A extends any[]> = {
//   (fn: FromHandler<T, A>): T
// }
//
// export interface AFlowFrom<T, A extends any[]> {
//   /**
//    * {@inheritdoc AFlowFrom}
//    * The base class for all {@link https://en.wikipedia.org/wiki/Widget | widgets}.
//    *
//    * @remarks
//    * Implements the {@link ValueReceiver} interface.  To draw the widget,
//    * call the {@link FromFlowFn | draw() function}.
//    *
//    * @public
//    */
//   quantum: FromFlowFn<T, A>
//   some: FromFlowFn<T, A>
//   strong: FromFlowFn<T, A>
//   weak: FromFlowFn<T, A>
// }
//
//
// export function fromFlows(atom: Atom, ...flows: AFlow<any>[]) {
//   if (atom.haveFrom) {
//     throw `atom ${
//       atom.id ? atom.id : ''
//     } already has a assigned 'from(flows..', reassign 'from' to attest to logic errors`
//   } else {
//     atom.haveFrom = true
//   }
//   let someoneIsWaiting = []
//   const freeWaiters = v => {
//     while (someoneIsWaiting.length) someoneIsWaiting.pop()(v)
//   }
//   const makeMix = mixFn => {
//     const inAwaiting: AFlow<any>[] = []
//     let values = flows.map(flow => {
//       if (flow.inAwaiting) {
//         inAwaiting.push(flow)
//       }
//       return flow.value
//     })
//     if (inAwaiting.length > 0) {
//       return new Promise(_ => someoneIsWaiting.push(_))
//     }
//     atom.getterFn = () => makeMix(mixFn)
//     let nextValues = mixFn(...values)
//     if (isPromise(nextValues)) {
//       nextValues.then(v => {
//         freeWaiters(v)
//         setAtomValue(atom, v)
//       })
//     } else {
//       freeWaiters(nextValues)
//       setAtomValue(atom, nextValues)
//     }
//     return nextValues
//   }
//
//   function weak(mixFn) {
//     flows.forEach(flow => {
//       if (flow != atom.proxy) flow.next(() => makeMix(mixFn))
//     })
//     makeMix(mixFn)
//   }
//
//   function quantum(mixFn, opt?: { strong?: any[]; some?: boolean }) {
//     let needToRun = flows.length
//     let waitCount = 0
//     let waitSet = new Set()
//     return new Promise(done => {
//       atom.getterFn = () => new Promise(_ => someoneIsWaiting.push(_))
//       function countActiveFlows() {
//         if (waitSet) {
//           waitSet.add(this)
//           if (waitSet.size == needToRun) {
//             waitSet = null
//             done(makeMix(mixFn))
//           }
//         } else done(makeMix(mixFn))
//       }
//       flows.forEach(flow => {
//         //for this flow in mix
//         if (flow == atom.proxy) needToRun--
//         else {
//           if (!opt) {
//             flow.up(countActiveFlows)
//           } else {
//             if (opt.strong && flow.isAsync) {
//               flow()
//               opt.strong.push(flow)
//             } else {
//               waitCount++
//             }
//             if (opt.some) {
//               flow.upSome(countActiveFlows)
//             }
//           }
//         }
//       })
//     })
//   }
//   function strong(mixFn) {
//     const strong = []
//     atom.strongFn = () => {
//       return new Promise(fin => {
//         if (strong.length) {
//           Promise.all(strong.map(f => f())).then(() => {
//             fin(atom.value[0])
//           })
//         } else {
//           return fin(makeMix(mixFn))
//         }
//       })
//     }
//     return quantum(mixFn, { strong })
//   }
//
//   function some(mixFn) {
//     return quantum(mixFn, { some: true })
//   }
//
//   return {
//     quantum,
//     some,
//     weak,
//     strong,
//   }
// }
