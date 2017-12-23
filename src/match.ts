import {isArray, isFunction} from "util";

function parsePattern(pattern) {
    let o = {else: null, map: {}}
    let keys = []
    let fn = []
    let j = 0
    let lastFnIndex = -100
    keys[j] = []
    for (let i = 0; i < pattern.length; i++) {
        let v = pattern[i]
        switch (typeof v) {
            case "function" :
                fn[j] = v
                j++
                if (pattern.length - 1 == i && lastFnIndex == i - 1)
                    o.else = v
                else
                    keys[j] = []
                lastFnIndex = i
                break
            default :
                keys[j].push(v)
        }
    }
    keys.forEach((k, index) => o.map[k] = fn[index])
    return o
}

export function patternMatch(arg) {
    let a = arg
    if (a.length >= 2) {
        let p = parsePattern(a)
        return (...value) => {

            let matchFn = p.map[value.join(',')]
            if (!matchFn) matchFn = p.map[value[0]]
            if (matchFn) matchFn.apply(matchFn, value)
            else if (p.else) p.else.apply(matchFn, value)
        }
    } else {
        a = a[0]
        if (isFunction(a)) {
            let fn = a as any as Function
            return (...value) => {
                let pattern = fn.apply(fn, value)
                let runFns = []
                pattern.forEach((v, i) => {
                    let lastPattern = pattern[i - 1]
                    if (isFunction(v) && lastPattern && !isFunction(lastPattern))
                        runFns.push(v)

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
        console.error("patternMatch unsupported pattern", v, arg)
    }
}