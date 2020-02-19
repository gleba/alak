import { createObjectFlow, createProxyFlow, installExtension } from '../core/create'
// import { AFlowFrom, fromFlows } from '../from/from'
import { patternMatch } from '../match/match'
import { ProxyFlow } from '../core'

installExtension({
  handlers: {
    // from: fromFlows,
    match: patternMatch,
  }
})

export interface AFlow<T> extends ProxyFlow <T> {
  // from<A extends AFlow<A>[]>(...a: A): AFlowFrom<T, A>
  match(...pattern: any[]): AFlow<T>
}

export const A = createProxyFlow


export default A
