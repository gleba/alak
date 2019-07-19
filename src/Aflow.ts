import {deepClone, deleteParams, remove} from "./utils";
import {patternMatch} from "./match";
import {isFunction} from "util";

export function flow(a?) {
  let listeners = []
  let metaList = []
  let imListeners = new Map()
  let onceListeners = []
  let keepState = true
  let immutable = false
  let mutableFx = false
  let emitter = false
  let effector = null
  let wrapper = null
  let mapObjects: any //Map<any, Function>

  const fx = (v) => {
    if (effector && v.length) {
        return v.map(effector)
    }
    return v
  }
  let proxy = Object.create(null)
  proxy = {
    data: [],
    next(fn, context) {
      listeners.push([context?context:fn, fn])
    },
    once(fn, context) {
      if (proxy.data.length > 0)
        fn.apply(context, fx(proxy.data))
      else {
        onceListeners.push(fn)
        listeners.push([context?context:fn, fn])
      }
    },
    on(fn, context) {
      listeners.push([context?context:fn, fn])
      if (proxy.data.length > 0)
        fn.apply(context, fx(proxy.data))
    },
    off(fn) {
      if (imListeners.has(fn)) {
        remove(listeners, imListeners.get(fn))
        imListeners.delete(fn)
      } else {
        remove(listeners, fn)
      }
    },
    im(fn, e) {
      let imFn = (...a) => fn.apply(fn, fx(a.map(deepClone)))
      imListeners.set(fn, imFn)
      listeners.push([fn, imFn])
      if (proxy.data.length > 0) {
        fn.apply(this, fx(proxy.data.map(deepClone)))
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
      if (Array.isArray(v) && !mutableFx) v = fx(v)
      listeners.forEach(f => f[1].apply(f[0], v))
      while (onceListeners.length>0) {
        remove(listeners, onceListeners.shift())
      }
        // remove(listeners, onceListeners.shift)
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
    silent(...v) {
      functor['data'] = proxy.data = v
      functor['v'] = v ? v.length > 1 ? v : v[0] : null
    }
  }

  const getValue = () => {
    let v = proxy.data ? proxy.data.length > 1 ? proxy.data : proxy.data[0] : null
    return immutable ? deepClone(v) : v
  }
  const setValues = v => {
    v = immutable ? deepClone(v) : v
    if (v.length > 0 || emitter) {
      if (keepState) {
        if (mutableFx) v = fx(v)
        functor['data'] = proxy.data = v
        functor['v'] = v ? v.length > 1 ? v : v[0] : null
      }
      if (emitter && !v) v = true
      if (Array.isArray(v) && !mutableFx) v = fx(v)
      listeners.forEach(f => f[1].apply(f[0], v))
      while (onceListeners.length>0)
        remove(listeners, onceListeners.shift())
    }
  }

  function functor(...a) {
    // console.log(...a)

    if (!proxy) {
      console.error("try to emit closed channel: " + a)
      return
    }


    if (wrapper && a.length) {
      setValues([wrapper(...Object.values(arguments), getValue())])
    } else {
      setValues(Object.values(arguments))
    }
    if (a.length) {
      return afn
    }
    return fx([getValue()])[0]
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
    setId(id) {
      proxy.id = id
    },
    setMetaObj(o) {
      proxy.o = o
    },
    extend(key, o) {
      proxy[key] = o
    },
    push(value) {
      let v = getValue()
      if (Array.isArray(v)) {
        v.push(value)
        proxy.emit()
      }
    },
    set(ki, value) {
      let v = getValue()
      v[ki] = value
      proxy.emit()
    },
    each(f:(value, ki, target)=>void) {
      let v = getValue()
      if (Array.isArray(v)) {
        v.forEach((item,i)=>f(item,i,v))
      } else {
        Object.keys(v).forEach(k=>f(v[k],k,v))
      }
      proxy.emit()
    },
    map(f:(value, ki)=>any) {
      let v = getValue()
      if (Array.isArray(v)) {
        return v.map((v,i)=>f(v,i))
      } else {
        let o = {}
        Object.keys(v).forEach(k=>o[k]=f(v[k],k))
        return o
      }
    },
    remove(ki) {
      let v = getValue()
      if (Array.isArray(v)) {
        v.splice(v.indexOf(ki), 1);
        proxy.emit()
      } else {
        delete v[ki]
        proxy.emit()
      }
    },
    wrap(fn) {
      wrapper = fn
    },
    unwrap() {
      wrapper = null
    },
    effect(fn, mutable = false) {
      effector = fn
      mutableFx = mutable
      let v = getValue()
      if (v!=null)
        setValues([v])
    },
    clearEffect() {
      if (effector){
        effector = null
        mutableFx = false
        setValues([getValue()])
      }
    },
    nullSafe(v){
      if (v!==null && v!==undefined)
        setValues([v])
    },
    loopSafe(v){
      if (v!== getValue())
        setValues([v])
    }
  })

  Object.assign(functor, proxy)

  const integralMix = (...af:any) =>{

    let mutator = af[af.length-1].isFlow ? false : af.pop()
    let s = new Map()
    let allTrue = false
    if (af.length == 1 ){
      if (Array.isArray(af[0])) {
        af = af[0]
      }
    }

    af.forEach(f=>{
      // console.log(f.isFlow)
      f.on(v=>{
        if (!allTrue) {
          s.set(f, true)
          if (s.size == af.length){
            allTrue = true
            s.clear()
          }
        }
        if (allTrue) {
          let mixedValue = af.map(f=>f.v)
          if (mutator) {
            mixedValue.push(getValue())
            let mutatedValue = mutator(...mixedValue)
            if (mutatedValue===undefined) {
              throw "Mixed Integral mutation function returns an undefined value."
            }
             setValues([mutatedValue])
          } else {
            setValues(mixedValue)
          }
        }
      })
    })
  }
  const afn = new Proxy(functor, {
    get(f, pk) {
      if (f[pk])
        return f[pk]
      switch (pk) {
        case "link":
        case "to":
          return proxy.on
        case "v":
        case "value":
          return getValue()
        case "iMix":
        case "integralMix":
        case "mixedIntegral":
          return integralMix

        case "immutable":
          immutable = true
          let v = getValue()
          return ()=> {
            setValues([v])
          }
        case "imv":
        case "cloneValue":
        case "immutableValue":
          return deepClone(getValue())
        case "id":
          return proxy.id
        case "isFlow":
          return true
        case "o":
        case "metaData":
          return proxy.o
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
  return afn
}
