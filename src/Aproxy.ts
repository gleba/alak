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
      case "fn":
        let f = flow()
        let metas = []
        let p = new Proxy({}, {
          get(px, k) {
            console.log("get px", k)
            if (f.isFlow(k)) {
              f.meta(...metas)
              return "xx"
            } else {
              metas.push(k)
              return p
            }
          }
        })
        return v => p
      default :
        if (metaExtends[key])
          return target[key]
        return target[key]
    }
  }
}) as any
// Aproxy.prototype.['toString'] = zx=>"xxx"