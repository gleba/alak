
declare interface AStream<T> {
    (value?: T): T
    value: T
    promise: PromiseLike<any>
    on(fn: (v: T) => void)
    silent(fn: (v: T) => T): T
    end: Function
}

declare interface AParser<T> {
    (v: any): AStream<T>
}

declare module "alak" {
    interface A {
        start: <T>(v?, parser?:AParser<T>)=>AStream<T>
    }
}