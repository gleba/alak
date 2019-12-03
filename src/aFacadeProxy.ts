import { newFlow } from './Aflow'
import { dev } from './devConst'
import { getConnector } from './devTool'

export const AFacadeProxy = new Proxy(newFlow, {
  get(target, key) {
    switch (key) {
      case 'number':
      case 'arrayOfNumbers':
      case 'arrayOfStrings':
      case 'arrayOfBool':
      case 'bool':
      case 'arrayOfObject':
      case 'object':
      case 'f':
        return newFlow()
      case 'any':
      case 'dict':
        return newFlow
      case 'flow':
        return newFlow
      case 'enableLogging':
        return () => {
          dev.debug = true
          dev.post = getConnector()
        }
      case 'canLog':
        return dev.debug
      case 'log':
        return (...a) => dev.hook.apply(dev, a)

      case 'STATE_READY':
        return 'ready'
      case 'STATE_AWAIT':
        return 'await'
      case 'STATE_EMPTY':
        return 'empty'
      case 'STATE_CLEAR_VALUE':
        return 'clear_value'
    }
  },
}) as any
