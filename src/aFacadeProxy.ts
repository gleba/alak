import {flow} from "./Aflow";
import {dev} from "./dev";
import {getConnector} from "./devTool";


let metaExtends = {}

export const AFacadeProxy = new Proxy({}, {
  get(target, key) {
    switch (key) {
      case "f":
      case "flow":
        return flow
      case "enableLogging":
        return () => {
          dev.itis = true
          dev.post = getConnector()
        }
      case "canLog":
        return dev.itis
      case "log":
        return (...a)=>dev.hook.apply(dev,a)
      default :
        if (metaExtends[key])
          return metaExtends[key]
        return target[key]
    }
  }
}) as any
