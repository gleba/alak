import { ComputeStrategy, fromFlows } from '../ext-computed'
import A from '../facade'
import { installExtension } from '../core'

/**
 * Расширение паттерн-матчинга
 * @remarks
 * @public
 * @packageDocumentation
 */


// @ts-ignore
declare module 'alak/core' {
  interface ProxyAtom<T> {
    match(...pattern: any[]): ProxyAtom<T>
  }
}

function installMatchingExtension(){
  installExtension({
    handlers: {
      match,
    },
  })
}

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}
function parsePattern(pattern) {
  let o = { else: null, map: new Map(), json: {}, fn: [] }
  let pair = {} as any

  pattern.forEach((part, i) => {
    // console.log(i, part, typeof part)
    if (!(i % 2)) {
      switch (typeof part) {
        case 'function':
          if (pattern.length - 1 == i) {
            o.else = part
          } else pair = { type: 'fun', part }
          break
        case 'object':
          pair = { type: 'json', part, json: JSON.stringify(part) }
          break
        default:
          pair = { type: 'key', part }
      }
    } else {
      switch (pair.type) {
        case 'fun':
          o.fn.push([pair.part, part])
          break
        case 'json':
          o.json[pair.json] = part
          o.map.set(pair.part, part)
        case 'key':
          o.map.set(pair.part, part)
      }
    }
  })
  return o
}

export function match(arg) {
  let a = arg
  if (a.length >= 2) {
    let pattern = parsePattern(a)

    return (...value) => {
      let v = value[0]
      let matchFn
      if (pattern.map.has(v)) {
        matchFn = pattern.map.get(v)
      }
      if (!matchFn)
        pattern.fn.forEach(([f, mf]) => {
          if (f(v)) matchFn = mf
        })
      if (!matchFn && typeof v === 'object') {
        matchFn = pattern.json[JSON.stringify(v)]
      }
      if (!matchFn && pattern.else) matchFn = pattern.else

      if (matchFn) matchFn.apply(matchFn, value)
    }
  } else {
    a = a[0]

    if (isFunction(a)) {
      let fn = (a as any) as Function
      return (...value) => {
        let pattern = fn.apply(fn, value)
        let runFns = []
        pattern.forEach((v, i) => {
          let lastPattern = pattern[i - 1]
          if (isFunction(v) && lastPattern && !isFunction(lastPattern)) runFns.push(v)
        })
        if (runFns.length == 0) {
          let l = pattern.length
          if (isFunction(pattern[l - 1]) && isFunction(pattern[l - 2])) {
            runFns.push(pattern[l - 1])
          }
        }
        runFns.forEach(f => f.apply(fn, value))
      }
    }
  }
  return v => {
    console.error('patternMatch unsupported pattern', v, arg)
  }
}
