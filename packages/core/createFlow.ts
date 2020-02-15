import { flowProxyHandler } from './flowProxyHandler'
import { createFunctor } from './functor'

export function createFlow(...a) {
  const functor = createFunctor() as any
  if (a.length) {
    functor(...a)
  }
  const flow = new Proxy(functor, flowProxyHandler) as AFlow<any>
  functor.proxy = flow
  return flow
}
