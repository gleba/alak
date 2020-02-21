
import { patternMatch } from '../match/match'
import { installExtension } from '../core/create'
import { AC } from '../core'


installExtension({
  handlers: {
    match: patternMatch,
  },
})

// // @ts-ignore
// declare module 'alak/lib/core' {
//   interface ProxyFlow<T> {
//     match(...pattern: any[]): ProxyFlow<T>
//   }
// }


export const A = Object.assign(AC, {
  getter(getter){
    const flow = AC.proxy()
    flow.useGetter(getter)
    return flow
  }
})

export default A
