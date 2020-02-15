// import { getConnector } from './devTool'
// import { Functor } from '../core/functor'
// // import { LogHook } from '../definitions'
//
// // value: any
// // duration: number
// type UpdateMap = {
//   [uid: number]:any
// }
//
// export const dev = {
//   debug: false,
//   flows: {} as UpdateMap,
//   sid: Math.random(),
//   hook(h) {
//     // console.log(h, "hook")
//     this.post('/', { sid: this.sid, ...h })
//   },
//   updatingStarted(flow: Functor, context) {
//     let duration = Date.now()
//     let uid = flow.uid
//     this.flows[uid] = { uid, context, duration }
//   },
//   updatingFinished(uid: number, value) {
//     let v = this.flows[uid]
//     v.duration = Date.now() - v.duration
//     // console.log("updatingFinished", value)
//
//     this.post('/', { value, type: 'update', sid: this.sid, ...v })
//   },
// } as any
