import {AFunctor, AnyFunction, notifyTheChildren, setFunctorValue} from './aFunctor'
import { deleteParams } from './utils'
import { patternMatch } from './match'
import { aFromFlows } from './aFrom'
import {addStateEventListener, proxyStateOffMap, proxyStateOnMap} from './FlowState'

export const alive = v => (v !== undefined && v !== null) as boolean
export const isTruth = v => !!v
export const nullFilter = f => v => (alive(v) ? f(v) : null)
export const someFilter = f => v => (!alive(v) ? f(v) : null)
export const trueFilter = f => v => (isTruth(v) ? f(v) : null)

export const aProxyHandler: ProxyHandler<AFunctor> = {
  get(functor: AFunctor, prop: string) {
    switch (prop) {
      //base
      case 'v':
      case 'value':
        return functor.value.length>=1 ? functor.value[0] : undefined
      case 'clear':
        return () => {
          functor.children.clear()
          functor.grandChildren.clear()
          functor.asEventsListeners.clear()
          functor.value = []
          delete functor.haveFrom
        }
      case 'clearValue':
        return () => (functor.value = [])
      case 'close':
        return () => {
          functor.children.clear()
          deleteParams(functor)
        }
      case 'notify':
        return () => notifyTheChildren(functor)
      case 'next':
        return f => functor.children.add(f)
      case 'up':
        return f => {
          functor.children.add(f)
          if (functor.value && functor.value.length) f.apply(f, functor.value)
        }
      case 'down':
        return f => {
          if (functor.children.has(f)) functor.children.delete(f)
          else if (functor.grandChildren.has(f)) functor.grandChildren.delete(f)
        }
      case 'once':
        return f => {
          if (functor.value && functor.value.length) f.apply(f, functor.value)
          else {
            const once = v => {
              f.apply(f, functor.value)
              functor.children.delete(once)
            }
            functor.children.add(once)
          }
        }

      case 'apply':
        return (context, v) => {
          functor.bind(context)

          setFunctorValue(functor, v[0])
        }

        //sugar
      case 'isEmpty':
        return !functor.value.length
      case 'is':
        return v => {
          if (functor.value && functor.value.length) {
            return functor.value[0] === v
          } else {
            return v === null || v === undefined
          }
        }

      case 'upSome':
        return f => {
          functor.grandChildren.set(f, nullFilter(f))
          let v = functor.value[0]
          if (alive(v)) f.apply(f, [v])
        }
      case 'upTrue':
        return f => {
          functor.grandChildren.set(f, trueFilter(f))
          let v = functor.value[0]
          if (v) f.apply(f, [v])
        }
      case 'upNone':
        return f => {
          functor.grandChildren.set(f, someFilter(f))
          let v = functor.value[0]
          if (functor.value.length && !alive(v)) f.apply(f, [v])
        }

      //meta
      case 'setId':
        return id => (functor.id = id)
      case 'id':
        return functor.id
      case 'addMeta':
        return (metaName, value?) => {
          if (!functor.metaMap) functor.metaMap = new Map<string, any>()
          functor.metaMap.set(metaName, value ? value : null)
        }
      case 'hasMeta':
        return metaName => {
          if (!functor.metaMap) return false
          return functor.metaMap.has(metaName)
        }
      case 'getMeta':
        return metaName => {
          if (!functor.metaMap) return null
          return functor.metaMap.get(metaName)
        }


      //experimental
      case 'on':
        return proxyStateOnMap(functor)
      case 'off':
        return proxyStateOffMap(functor)

      //strong
      case 'useWarp':
      case 'useGetter':
      case 'useWrapper':
        return (fn:AnyFunction) => functor.getterFn = fn
      case "isAsync":
        return functor.meta && functor.meta.born;
      case 'match':
        return (...pattern) => {
          let f = patternMatch(pattern)
          functor.children.add(f)
          if (functor.value && functor.value.length) f.apply(f, functor.value)
        }
      case 'mutate':
        return mutatorFn => setFunctorValue(functor, mutatorFn(...functor.value))
      case "from":
        return (...flows) => aFromFlows(functor, ...flows);
    }
    return false
  },
}
