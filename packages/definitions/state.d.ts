// type AboutStateEvents = {
//   (eventName: string, fn: AnyFunction): void
//   [eventName: string]: (fn: AnyFunction) => void
//   /** send true if value are computing in async warp function*/
//   await: (fn: AnyFunction) => void
//   /** send when first fill data value*/
//   ready: (fn: AnyFunction) => void
// }
//
type OnFlowState = {
  (eventName: FlowState, fn: AnyFunction): void
  // [eventName: string]: (fn: AnyFunction) => void
  // await: (fn: AnyFunction) => void
}


type FlowState = "empty" | "await" | "update" | string
