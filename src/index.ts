import {deleteParams, remove} from "./utils";
import {patternMatch} from "./match";


export type Listener<T extends any> = (...a: T[]) => any
export type TypeFN<T> = (...a: any[]) => T

export interface AFunctor<T extends any> {
    (...a: T[]): T

    value: T

    on(fn: Listener<T>): AFunctor<T>

    end(): void

    match(...pattern)

    mutate(fn: Listener<T>): T

    branch<U>(fn: (...a: any[]) => U): AFunctor<U>

    stop(fn): void
}

//, ...b: any[]


// function compose<T, ...U>(base: T, ...mixins: ...U): T&U {}
export default function DFlow<T>(...a: T[]): AFunctor<T> {
    type Fn = Listener<T>
    let listeners = []
    let proxy = {
        value: [],
        get v(): T {
            return getValue()
        },
        on: function (fn: Fn) {
            listeners.push([this, fn])
            if (proxy.value.length > 0)
                fn.apply(this, proxy.value)
        },
        end: () => {
            deleteParams(functor)
            deleteParams(proxy)
            listeners = null
            proxy = null
        },
        mutate: function (fn: Fn) {
            let newValue = fn.apply(this, proxy.value)
            setValue(newValue)
        },
        match: function () {
            proxy.on(AMatch(arguments))
        },
        stop: (fn) => {
            remove(listeners, fn)
        },
        branch(f) {
            let newCn = DFlow()
            console.log(f)
            proxy.on((...v) => newCn(f(...v)))
            return newCn
        },
    }

    const getValue = () => proxy.value ? proxy.value.length > 1 ? proxy.value : proxy.value[0] : null
    const setValue = v => {
        if (v.length > 0) {
            proxy.value = v
            listeners.forEach(f => f[1].apply(f[0], v))
        }
    }

    function functor(...a) {
        if (!proxy) {
            console.error("emit ended channel: " + a)
            return
        }
        setValue(Object.values(arguments))
        return getValue()
    }

    setValue(Object.values(arguments))
    Object.assign(functor, proxy)
    return functor as any as AFunctor<T>
}
export const AMatch = patternMatch
export const A = {
    start: DFlow
}