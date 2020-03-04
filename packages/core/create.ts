import { createAtom } from './atom'
import { allHandlers, objectHandlers, properties } from './handlers'
import { CoreAtom } from './index'
import { DECAY_ATOM_ERROR, PROPERTY_ATOM_ERROR } from './utils'

const handlers = Object.assign(objectHandlers, allHandlers)



/**
 * Установить расширения атома
 * @param options - {@link ExtensionOptions}
 */
export function installAtomExtension(options) {
  options.handlers && Object.assign(handlers, options.handlers)
  options.properties && Object.assign(properties, options.properties)
}

function get(atom: CoreAtom, prop: string, receiver: any): any {
  if (!atom.children) {
    throw DECAY_ATOM_ERROR
  }
  let keyFn = handlers[prop]
  if (keyFn) return keyFn.bind(atom)
  keyFn = properties[prop]
  if (keyFn) return keyFn.call(atom)
  throw PROPERTY_ATOM_ERROR
}
export const proxyHandler: ProxyHandler<CoreAtom> = { get }

export function createProtoAtom<T>(value?: T) {
  const atom = createAtom(...arguments)
  atom.__proto__ = handlers
  atom.proxy = atom
  atom.uid = Math.random()
  atom.alive = true
  return atom
}

export function createProxyAtom<T>(value?: T) {
  const atom = createAtom(...arguments)
  const proxy = new Proxy(atom, proxyHandler)
  atom.proxy = proxy
  atom.uid = Math.random()
  atom.alive = true
  return proxy
}
