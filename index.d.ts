interface _AStream<T> {
    (value?: T): T
    value: T
    promise: PromiseLike<any>
    on(fn: (v: T) => void)
    silent(fn: (v: T) => T): T
    end: Function
}

interface iAParser<T> {
    (v: any): _AStream<T>
}


interface iObj<T> {
    [p:number]:T
    [p:string]:T
}

export const start: <T>(v?, parser?: iAParser<T>)=>_AStream<T>
export const mix: (...ar:_AStream<any>[])=>_AStream<any[]>
export const match: (value: any, pattern: iObj<Function>, data?)=>void
