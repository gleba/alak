/// <reference path="./flow.d.ts" />
/// <reference path="./flowFrom.d.ts" />
/// <reference path="./state.d.ts" />

type AnyFunction = {
  (...v: any[]): any
}

type MaybeAny<T> = unknown extends T ? any : T

interface A_Facade {
  <T>(v?: T): AFlow<MaybeAny<T>>
}
