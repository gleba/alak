import {flow} from "./Aflow";


let metaExtends = {}

export const AFacadeProxy = new Proxy({
}, {
  get(target, key) {
    // console.log(key)

    switch (key) {
      case "f":
      case "flow":
        return flow
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
