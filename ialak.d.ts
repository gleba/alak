
interface IAStream<T> {
    (value?: T): T
    value: T
    promise: PromiseLike<any>
    on(fn: (v: T) => void)
    silent(fn: (v: T) => T): T
    end: Function
}

interface IAMonad<T> {
    (v: any): IAStream<T>
}


interface iObj<T> {
    [p: number]: T
    [p: string]: T
}


// export const new: <T>(v?)=>IAwave<T>
export const once: <T>(fn?: IAMonad<T>)=>IAStream<T>
export const start: <T>(v?, monadFN?: IAMonad<T>)=>IAStream<T>
export const mix: (...ar: IAStream<any>[])=>IAStream<any[]>
export const match: (value: any, pattern: iObj<Function>, data?)=>void

