import { createAtom, Atom } from './atom'
import { allHandlers, objectHandlers, FlowHandlers, properties } from './handlers'
import { ObjectFlow } from './index'

const handlers = Object.assign(objectHandlers, allHandlers)



export type ExtensionHandlers = {
  handlers?: FlowHandlers
  properties?: FlowHandlers
}

export function installExtension(props:ExtensionHandlers) {
  props.handlers && Object.assign(handlers, props.handlers)
  props.properties && Object.assign(properties, props.properties)
}

function get(atom: Atom, prop: string, receiver: any): any {
  let keyFn = handlers[prop]
  if (keyFn) return keyFn.bind(atom)
  keyFn = properties[prop]
  if (keyFn) return keyFn.apply(atom)
  throw 'unknown property - ' + prop
}
export const proxyHandler: ProxyHandler<Atom> = { get }


type MaybeAny<T> = unknown extends T ? any : T

/**
 * Конструктор контейнера потока.
 * @remarks
 * Только основные функции.
 * Максимальная скорость доставки, за счёт увеличения потребления памяти.
 * Только если нет возможности использовать Proxy.
 * @param value необязательное стартовое значние
 * @returns {@link ObjectFlow}
 */
export function createObjectFlow<T>(value?:T, ...auxiliaryValues): ObjectFlow<MaybeAny<T>> {
  const atom = createAtom(...arguments)
  const flow = Object.assign(atom, objectHandlers)
  atom.proxy = flow
  return flow as any
}

export function createProxyFlow(...a) {
  const atom = createAtom(...a)
  const flow = new Proxy(atom, proxyHandler)
  atom.proxy = flow
  return flow as any
}
