import {AFunctor, notifyTheChildren, setFunctorValue} from "./aFunctor";
import {deleteParams} from "./utils";
import {patternMatch} from "./match";

let metaExtends = {}

export const aProxyHandler: ProxyHandler<AFunctor> = {
  get(functor: AFunctor, prop: string) {
    switch (prop) {
      case "v":
      case "value":
      case "data":
        return functor.value.length > 1 ? functor.value : functor.value[0]
      case "up":
      case "$":
      case "on":
        return f => {
          functor.childs.add(f)
          if (functor.value && functor.value.length)
            f.apply(f, functor.value)
        }
      case "down" :
      case "off" :
        return f => {
          functor.childs.delete(f)
        }
      case "kill" :
      case "end" :
        return () => {
          functor.childs.clear()
          deleteParams(functor)
        }
      case "notifyChildren" :
      case "emit" :
        return () => notifyTheChildren(functor)
      case "match" :
        return (...pattern) => {
          functor.childs.add(patternMatch(pattern))
        }
      case "mutate" :
        return f => {
          setFunctorValue(functor, ...f(...functor.value))
        }
    }
    return true
  }
};
