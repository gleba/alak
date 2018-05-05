import {IAflow} from "./def/IAflow";
import {deleteParams, remove} from "./utils";
import {patternMatch} from "./match";
import {Listener} from "./def";

export function flow<T>(...a: T[]): IAflow<T> {
  type Fn = Listener<T>
  let listeners = []
  let metaList = []
  let keepState = true
  let emitter = false
  let mapObjects: any //Map<any, Function>
  // let weakListeners = new WeakMap()
  // let weakUid = []
  let proxy = {
    data: [],
    on: (fn: Fn) => {
      listeners.push([fn, fn])
      if (proxy.data.length > 0)
        fn.apply(fn, proxy.data)
    },
    curryOn: function (fn: Fn) {
      listeners.push([this, fn])
      if (proxy.data.length > 0)
        fn.apply(this, proxy.data)
    },
    weakOn: (where, f: Fn) => {
      let ws = new WeakSet()
      ws.add(where)
      // weakListeners.set(where, f)
      // weakUid.push(ws)
      if (proxy.data.length > 0)
        f.apply(f, proxy.data)
    },
    end: () => {
      deleteParams(functor)
      deleteParams(proxy)
      listeners = null
      proxy = null
    },
    emit: () => {
      listeners.forEach(f => f[1].apply(f[0], proxy.data))
    },
    mutate: function (fn: Fn) {
      let newValue

      if (proxy.data.length > 1) {
        newValue = fn.apply(this, proxy.data)
        setValues(newValue)
      } else {
        newValue = fn.apply(this, [getValue()])
        setValues([newValue])
      }
    },
    match: function () {
      proxy.on(patternMatch(arguments))
    },
    drop: () => listeners = [],
    remove(fn) {
      remove(listeners, fn)
    },
    branch(f) {
      let newCn = flow()
      proxy.on((...v) => newCn(...f(...v)))
      return newCn
    },
    inject(obj?: any, key?: string) {
      if (!obj) obj = {}
      if (!mapObjects) mapObjects = new Map<any, Function>()
      let fn = key
        ? v => obj[key] = v
        : v => Object.keys(v).forEach(k => obj[k] = v[k])
      mapObjects.set(obj, fn)
      proxy.on(fn)
      return obj
    },
    reject(obj) {
      if (mapObjects.has(obj)) {
        proxy.remove(mapObjects.get(obj))
        mapObjects.delete(obj)
      }
    },
    stateless(on = true) {
      keepState = !on
      return this
    },
    emitter(on = true) {
      emitter = on
      return this
    }
  }

  const getValue = () => {
    return proxy.data ? proxy.data.length > 1 ? proxy.data : proxy.data[0] : null
  }
  const setValues = v => {
    if (v.length > 0 || emitter) {
      if (keepState) {
        functor['data'] = proxy.data = v
        functor['v'] = v ? v.length > 1 ? v : v[0] : null
      }
      if (emitter && !v) v = true
      listeners.forEach(f => f[1].apply(f[0], v))
      // if (weakUid.length) {
      //   weakUid.forEach(uid => {
      //     if (weakListeners.has(uid)) {
      //       let f = weakListeners.get(uid)
      //       f.apply(f, v)
      //     }
      //   })
      // }

    }
  }

  function functor(...a) {
    // console.log(...a)

    if (!proxy) {
      console.error("emit ended channel: " + a)
      return
    }
    setValues(Object.values(arguments))
    if (a.length) {
      return afn
    }
    return getValue()
  }

  let v = Object.values(arguments)
  setValues(v)


  Object.assign(proxy, {
    off: proxy.remove,
    meta(...meta) {
      if (meta.length) {
        metaList.push(...meta)
      }
      return metaList
    },
    isMeta(metaName) {
      return metaList.indexOf(metaName) > -1
    },
    isValue(...value) {
      return getValue() == value
    },
    isFlow(key?) {
      if (key)
        return Object.keys(proxy).indexOf(key) > -1
      else
        return true
    }
  })

  Object.assign(functor, proxy)
  const afn = new Proxy(functor, {
    get(f, pk) {
      if (f[pk])
        return f[pk]
      switch (pk) {
        case "immutable":
          let v = getValue()
          switch (typeof v) {
            case "string":
            case "number":
              return v
            default:
              // console.log("typeof v", typeof v)
              return new Proxy({}, {
                get(d, dk) {
                  v = getValue()
                  // console.log("proxy get Value", dk, getValue())
                  if (v) {
                    // console.log("is v ", v, v[dk])
                    if (v.hasOwnProperty(dk)) {
                      // console.log("is dk")
                      return v[dk]
                    } else {
                      // console.log("is one", v)
                      return v
                    }
                  } else {
                    return undefined
                  }
                }
              })
          }

        default :
          afn.meta(pk)
          return afn
      }
    }
  })
  return afn as any as IAflow<T>
}
