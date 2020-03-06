import { createCore } from './core'
import { coreProps, handlers, proxyProps } from './handlers'
import { Core } from './index'
import { DECAY_ATOM_ERROR, PROPERTY_ATOM_ERROR } from './utils'

let protoHandlers
function makeProtoHandlers() {
  protoHandlers = Object.defineProperties(Object.assign({}, handlers), coreProps)
}
makeProtoHandlers()
/**
 * Установить расширения атома
 * @param options - {@link ExtensionOptions}
 */
export function installAtomExtension(options) {
  options.handlers && Object.assign(handlers, options.handlers)
  makeProtoHandlers()
}

function get(atom: Core, prop: string, receiver: any): any {
  if (!atom.children) {
    throw DECAY_ATOM_ERROR
  }
  let keyFn = handlers[prop]
  if (keyFn) return keyFn.bind(atom)
  keyFn = proxyProps[prop]
  if (keyFn) return keyFn.call(atom)
  throw PROPERTY_ATOM_ERROR
}

export function createProtoAtom<T>(value?: T) {
  const atom = createCore(...arguments)
  // const atom = {
  //   core
  // } as any
  atom.__proto__ = protoHandlers
  atom._ = atom
  return atom
}

const proxyHandler: ProxyHandler<Core> = { get }
export function createProxyAtom<T>(value?: T) {
  const atom = createCore(...arguments)
  const proxy = new Proxy(atom, proxyHandler)
  atom._ = proxy
  atom.uid = Math.random()
  return proxy
}
