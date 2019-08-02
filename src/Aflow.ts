import {aProxyHandler} from "./aProxyHandler";
import {newAFunctor} from "./aFunctor";


export function flow(...a) {
  const functor = newAFunctor()
  // const proxy = new Proxy(functor, aProxyHandler)
  if (a.length) {
    functor(...a)
  }
  const proxy = new Proxy(functor, aProxyHandler)
  functor.proxy = proxy
  return proxy
}
