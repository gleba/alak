import { createAtom } from './atom'
import { allHandlers, objectHandlers,  properties } from './handlers'
import { Atom, ObjectAtom, ProxyAtom } from './index'

const handlers = Object.assign(objectHandlers, allHandlers)



/**
 * Установить расширения атома
 * @param options - {@link ExtensionOptions}
 */
export function installExtension(options) {
  options.handlers && Object.assign(handlers, options.handlers)
  options.properties && Object.assign(properties, options.properties)
}

function get(atom: Atom, prop: string, receiver: any): any {
  let keyFn = handlers[prop]
  if (keyFn) return keyFn.bind(atom)
  keyFn = properties[prop]
  if (keyFn) return keyFn.apply(atom)
  throw 'unknown property - ' + prop
}
export const proxyHandler: ProxyHandler<Atom> = { get }



export function createObjectAtom<T>(value?: T) {
  const atom = createAtom(...arguments)
  const flow = Object.assign(atom, objectHandlers)
  atom.proxy = flow
  return flow
}

export function createProxyFlow<T>(value?: T) {
  const atom = createAtom(...arguments)
  const flow = new Proxy(atom, proxyHandler)
  atom.proxy = flow
  return flow
}
