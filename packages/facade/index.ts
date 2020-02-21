import { patternMatch } from '../match/match'
import { installExtension } from '../core/create'
import { AC, MaybeAny, AFlow } from '../core'
import { fromFlows, FlowFrom } from '../from/from'

installExtension({
  handlers: {
    match: patternMatch,
    from: fromFlows,
  },
})

// @ts-ignore
declare module 'alak/lib/core' {
  interface AFlow<T> {
    match(...pattern: any[]): AFlow<T>
    from<A extends AFlow<any>[]>(...a: A): FlowFrom<T, A>
  }
}
//**
export interface AFacade {
  <T>(value?: T): AFlow<MaybeAny<T>>

  getter<T>(fun:()=>T):AFlow<T>
}

export const A = Object.assign(AC, {
  getter(getterFun){
    const flow = AC.proxy()
    flow.useGetter(getterFun)
    return flow
  },
}) as any as AFacade

export default A


export {AFlow} from "../core"
