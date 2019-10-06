import {newFlow} from "./Aflow";
import {devConst} from "./dev";
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
          devConst.itis = true
          devConst.post = getConnector()
        }
      case "canLog":
        return devConst.itis
      case "log":
        return (...a) => devConst.hook.apply(devConst, a)
    }
  }
}) as any
