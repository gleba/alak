import {flow} from "./Aflow";


let metaExtends = {}

export const Aproxy = new Proxy({
  start: flow,
  flow: flow,
  stateless: () => flow().stateless(),
  emitter: (...ar) => flow(...ar).emitter(),
  toString: () => 'Alak Fantasy FRP Library',
  install: (key, fn) => metaExtends[key] = fn
}, {
  get(target, key) {
    // console.log(key)

    switch (key) {
      case "f":
      case "flow":
        return flow()
      case "m":
      case "meta":
        return flow()
      default :
        if (metaExtends[key])
          return metaExtends[key]
        return target[key]
    }
  }
}) as any
// Aproxy.prototype.['toString'] = zx=>"xxx"