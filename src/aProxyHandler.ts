import { AFunctor, AnyFunction, notifyChildrens, setFunctorValue } from './aFunctor'
import { deleteParams } from './utils'
import { patternMatch } from './match'
import { aFromFlows } from './aFrom'
import {
  addStateEventListener,
  notifyStateListeners,
  proxyStateOffMap,
  proxyStateOnMap,
} from './FlowState'
import { A } from './index'

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
        return functor.value.length >= 1 ? functor.value[0] : undefined
      case 'clear':
        return () => {
          functor.children.clear()
          functor.grandChildren.clear()
          functor.asEventsListeners.clear()
          functor.value = []
          delete functor.haveFrom
        }
      case 'clearValue':
        notifyStateListeners(functor, A.STATE_CLEAR_VALUE)
        return () => (functor.value = [])
      case 'close':
        return () => {
          functor.children.clear()
          deleteParams(functor)
        }
      case 'notify':
        return () => notifyChildrens(functor)
      case 'next':
        return f => functor.children.add(f)
      case 'up':
        return f => {
          functor.children.add(f)
          if (functor.value && functor.value.length) f.apply(functor.proxy, functor.value)
        }
      case 'down':
        return f => {
          if (functor.children.has(f)) functor.children.delete(f)
          else if (functor.grandChildren.has(f)) functor.grandChildren.delete(f)
        }
      case 'once':
        return f => {
          if (functor.value && functor.value.length) f.apply(functor.proxy, functor.value)
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
          if (alive(v)) f.apply(functor.proxy, [v])
        }
      case 'upTrue':
        return f => {
          functor.grandChildren.set(f, trueFilter(f))
          let v = functor.value[0]
          if (v) f.apply(functor.proxy, [v])
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
      case 'setName':
        return name => (functor.flowName = name)
      case 'name':
        return functor.flowName
      case 'uid':
        return functor.uid
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
        return (fn: AnyFunction) => (functor.getterFn = fn)
      case 'useWrapper':
        return (fn: AnyFunction) => (functor.wrapperFn = fn)
      case 'isAsync':
        return !!(functor.isAsync || functor.getterFn || functor.wrapperFn || functor.strongFn)
      case 'inAwaiting':
        return functor.inAwaiting
      case 'match':
        return (...pattern) => {
          let f = patternMatch(pattern)
          functor.children.add(f)
          if (functor.value && functor.value.length) f.apply(f, functor.value)
        }
      case 'mutate':
        return mutatorFn => setFunctorValue(functor, mutatorFn(...functor.value))
      case 'from':
        return (...flows) => aFromFlows(functor, ...flows)
      case 'getImmutable':
        return () =>
          functor.value.length >= 1 ? JSON.parse(JSON.stringify(functor.value[0])) : undefined
      case 'injectOnce':
        return (o, key) => {
          if (!key) {
            key = functor.flowName ? functor.flowName : functor.id ? functor.id : functor.uid
          }
          if (!o) throw 'trying inject flow key : ' + key + ' to null object'
          o[key] = functor.value[0]
        }
    }
    return false
  },
}
