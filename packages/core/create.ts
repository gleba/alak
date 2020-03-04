import { createAtom } from './atom'
import { allHandlers, objectHandlers, properties } from './handlers'
import { Atom } from './index'
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

function get(atom: Atom, prop: string, receiver: any): any {
  if (!atom.children) {
    throw DECAY_ATOM_ERROR
  }
  let keyFn = handlers[prop]
  if (keyFn) return keyFn.bind(atom)
  keyFn = properties[prop]
  if (keyFn) return keyFn.call(atom)
  throw PROPERTY_ATOM_ERROR
}
export const proxyHandler: ProxyHandler<Atom> = { get }

export function createObjectAtom<T>(value?: T) {
  const atom = createAtom(...arguments)
  const flow = Object.assign(atom, objectHandlers)
  atom.proxy = flow
  atom.alive = true
  return flow
}

export function createProxyFlow<T>(value?: T) {
  const atom = createAtom(...arguments)
  const flow = new Proxy(atom, proxyHandler)
  atom.proxy = flow
  atom.uid = Math.random()
  atom.alive = true
  return flow
}
