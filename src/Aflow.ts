import {deepClone, deleteParams, remove} from "./utils";
import {patternMatch} from "./match";

export function flow(a?) {
  let listeners = []
  let metaList = []
  let imListeners = new Map()
  let keepState = true
  let emitter = false
  let mapObjects: any //Map<any, Function>
  // let weakListeners = new WeakMap()
  // let weakUid = []
  let proxy = Object.create(null)
  proxy = {
    data: [],
    on: fn => {
      listeners.push([fn, fn])
      if (proxy.data.length > 0)
        fn.apply(fn, proxy.data)
    },
    off(fn) {
      if (imListeners.has(fn)) {
        remove(listeners, imListeners.get(fn))
        imListeners.delete(fn)
      } else {
        remove(listeners, fn)
      }
    },
    im: function (fn) {
      let imFn = (...a) => fn.apply(this, a.map(deepClone))
      imListeners.set(fn, imFn)
      listeners.push([this, imFn])
      if (proxy.data.length > 0) {
        fn.apply(this, proxy.data.map(deepClone))
      }
    },
    end: () => {
      deleteParams(functor)
      deleteParams(proxy)
      listeners = null
      proxy = null
    },
    emit: () => {
      let v = emitter ? true : proxy.data
      listeners.forEach(f => f[1].apply(f[0], v))
    },
    mutate: function (fn) {
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
    },
    silent(v) {
      functor['data'] = proxy.data = v
      functor['v'] = v ? v.length > 1 ? v : v[0] : null
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
      console.error("try to emit closed channel: " + a)
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


  let x = Symbol.toPrimitive
  Object.assign(proxy, {
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
    },
    setId(id) {
      proxy.id = id
    },
    setMetaObj(o) {
      proxy.o = o
    },
    extend(key, o) {
      proxy[key] = o
    }
  })

  Object.assign(functor, proxy)
  const afn = new Proxy(functor, {
    get(f, pk) {
      if (f[pk])
        return f[pk]
      switch (pk) {
        case "v":
          return getValue()
        case "imv":
          return deepClone(getValue())
        case "o":
          return proxy.o
        case "id":
          return proxy.id
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


  Object.assign(afn, {
    [Symbol.toPrimitive](hint) {
      return `AFlow<${afn.v ? typeof afn.v : 'any'}>`;
    }
  })
  console.log()

  return afn
}
