import {deleteParams, remove} from "./utils";
import {patternMatch} from "./match";


export type Listener<T extends any> = (...a: T[]) => any
export type TypeFN<T> = (...a: any[]) => T

export interface DChannel<T extends any> {
    (...a: T[]): T

    data: T

    on(fn: Listener<T>): DChannel<T>

    end(): void

    match(...pattern)

    mutate(fn: Listener<T>): T

    branch<U>(fn: (...a: any[]) => U[]): DChannel<U>

    stop(fn): void

    drop(): void
}

//, ...b: any[]


// function compose<T, ...U>(base: T, ...mixins: ...U): T&U {}
export default function DFlow<T>(...a: T[]): DChannel<T> {
    type Fn = Listener<T>
    let listeners = []
    let proxy = {
        data: [],
        get v(): T {
            return getValue()
        },
        on: function (fn: Fn) {
            listeners.push([this, fn])
            if (proxy.data.length > 0)
                fn.apply(this, proxy.data)
        },
        end: () => {
            deleteParams(functor)
            deleteParams(proxy)
            listeners = null
            proxy = null
        },
        mutate: function (fn: Fn) {
            let newValue = fn.apply(this, proxy.data)
            setValue(newValue)
        },
        match: function () {
            proxy.on(AMatch(arguments))
        },
        drop: () => listeners = [],
        stop(fn) {
            remove(listeners, fn)
        },
        branch(f) {
            let newCn = DFlow()
            proxy.on((...v) => newCn(...f(...v)))
            return newCn
        },
    }

    const getValue = () => proxy.data ? proxy.data.length > 1 ? proxy.data : proxy.data[0] : null
    const setValue = v => {
        if (v.length > 0) {
            proxy.data = v
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
    return functor as any as DChannel<T>
}
export const AMatch = patternMatch
export const A = {
    start: DFlow
}