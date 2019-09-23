import { getConnector } from './devTool'
import { AFunctor } from './aFunctor'
import {LogHook} from "../index";

// value: any
// duration: number
type UpdateMap = {
  [uid:number]:LogHook
}


export const dev = {
  itis: false,
  flows: {} as UpdateMap,
  sid:Math.random(),
  hook(h:LogHook){
    this.post('/', {  sid: this.sid, ...h })
  },
  updatingStarted(flow: AFunctor, context) {
    let duration = Date.now()
    let uid = flow.uid
    this.flows[uid] = { uid, context, duration}
  },
  updatingFinished(uid: number, value) {
    let v = this.flows[uid]
    v.duration = Date.now() - v.duration
    this.post('/', { value, type:"update", sid: this.sid, ...v })
  },
} as any
