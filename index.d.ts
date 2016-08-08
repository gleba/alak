interface AStream<T> {
    (value?: T): T
    value: T
    promise: PromiseLike<any>
    on(fn: (v: T) => void)
    silent(fn: (v: T) => T): T
    end: Function
}

interface AParser<T> {
    (v: any): AStream<T>
}

export const start: <T>(v?, parser?: AParser<T>)=>AStream<T>

