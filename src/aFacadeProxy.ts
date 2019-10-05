import {newFlow} from "./Aflow";
import {dev} from "./dev";
import {getConnector} from "./devTool";


export const AFacadeProxy = new Proxy(newFlow, {
  get(target, key) {
    switch (key) {
      case "number":
      case "arrayOfNumbers":
      case "arrayOfStrings":
      case "arrayOfBool":
      case "bool":
      case "arrayOfObject":
      case "object":
      case "f":
        return newFlow()
      case "any":
        return newFlow
      case "flow":
        return newFlow
      case "enableLogging":
        return () => {
          dev.itis = true
          dev.post = getConnector()
        }
      case "canLog":
        return dev.itis
      case "log":
        return (...a) => dev.hook.apply(dev, a)
    }
  }
}) as any
