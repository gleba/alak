import { patternMatch } from '../match/match'
import { installExtension } from '../core/create'
import { AC, MaybeAny, ProxyFlow } from '../core'
import { fromFlows, FlowFrom } from '../from/from'

installExtension({
  handlers: {
    match: patternMatch,
    from: fromFlows,
  },
})

// @ts-ignore
declare module 'alak/lib/core' {
  interface ProxyFlow<T> {
    match(...pattern: any[]): ProxyFlow<T>
    from<A extends ProxyFlow<any>[]>(...a: A): FlowFrom<T, A>
  }
}

export interface AFlow<T> extends ProxyFlow<T> {
  match(...pattern: any[]): AFlow<T>
  from<A extends ProxyFlow<any>[]>(...a: A): FlowFrom<T, A>
}

//**
export interface AFacade {
  <T>(value?: T): ProxyFlow<MaybeAny<T>>

  getter<T>(fun:()=>T):ProxyFlow<T>
}

export const A = Object.assign(AC, {
  getter(getterFun){
    const flow = AC.proxy()
    flow.useGetter(getterFun)
    return flow
  },
}) as any as AFacade

export default A
