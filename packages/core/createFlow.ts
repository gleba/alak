
import { createFunctor, Functor } from './functor'
import { handlers, properties } from './handlers'


function get(functor: Functor, prop: string , receiver: any): any {
  let keyFn = handlers[prop]
  if (keyFn)
    return keyFn.bind(functor)
  keyFn = properties[prop]
  if (keyFn)
    return keyFn.apply(functor)
  throw "unknown property - "+prop
}
export const proxyHandler: ProxyHandler<Functor> = { get }

export function createFlow(...a) {
  const functor = createFunctor() as any
  if (a.length) {
    functor(...a)
  }

  // const flow = Object.assign(functor, handlers)
  const flow = new Proxy(functor, proxyHandler)
  functor.proxy = flow
  return flow
}
