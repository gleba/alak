
export interface AStream<T> {
    (value?: T | boolean): T
    VALUE: T
    PROMISE: PromiseLike<any>
    on(FN: (v: T) => void): void
    once(FN: (v: T) => void): void
    match(...any): void
    matchIn(inVar):any
    SILENT(fn: (v: T) => T): T
    end: Function
}

interface AMonad<T> {
    (v: any): AStream<T>
}

export interface IndexOf<T> {
    [p: number]: T
    [p: string]: T
}

export interface Static {
    once: <T>(fn?: AMonad<T>)=>AStream<T>
    start: <T>(v?: T)=>AStream<T>
    mix: (...ar: AStream<any>[])=>AStream<any[]>
    match: (value: any, pattern: IndexOf<Function>, data?: any)=>void
    matchFn: (...patterns: any[])=>(v)=>void,
    assign: (target: any, source: any)=>void
}

export const A: Static
// export default A
