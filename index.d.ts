export interface IAStream<T> {
    (value?: T): T
    VALUE: T
    PROMISE: PromiseLike<any>
    on(FN: (v: T) => void)
    SILENT(fn: (v: T) => T): T
    end: Function
}

interface IAMonad<T> {
    (v: any): IAStream<T>
}

export interface AO<T> {
    [p: number]: T
    [p: string]: T
}

export interface Static {
    once: <T>(fn?: IAMonad<T>)=>IAStream<T>
    start: <T>(v?, monadFN?: IAMonad<T>)=>IAStream<T>
    mix: (...ar: IAStream<any>[])=>IAStream<any[]>
    match: (value: any, pattern: AO<Function>, data?)=>void
}
