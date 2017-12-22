import {deleteParams} from "./utils";
import {patternMatch} from "./match";

export const AMatch = patternMatch
export type Listiner<T> = (...a: T[]) => any

export interface AFunctor<T> {
    (...a: T[]): T

    value: T

    on(fn: Listiner<T>): AFunctor<T>

    end(): void

    match(...pattern)

    map(fn: Listiner<T>): any
}

export default function AChannel<T>(...a: T[]): AFunctor<T> {
    type Fn = Listiner<T>
    let listiners = []
    let proxy = {
        value: [],

        on: function (fn: Fn) {
            listiners.push([this, fn])
            if (proxy.value.length > 0)
                fn.apply(this, proxy.value)
        },
        end: () => {
            deleteParams(functor)
            deleteParams(proxy)
            listiners = null
            proxy = null
        },
        map: function (fn: Fn) {
            let newValue = fn.apply(this, proxy.value)
            setValue(newValue)
        },
        match: function () {
            proxy.on(AMatch(arguments))
        }
    }

    const setValue = v => {
        if (v.length > 0) {
            proxy.value = v
            listiners.forEach(f => f[1].apply(f[0], v))
        }
    }

    function functor(...a) {
        if (!proxy) {
            console.error("emit ended channel: " + a)
            return
        }
        setValue(Object.values(arguments))
        return proxy.value
    }

    setValue(Object.values(arguments))
    Object.assign(functor, proxy)
    return functor as any as AFunctor<T>
}
