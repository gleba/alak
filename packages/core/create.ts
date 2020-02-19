import { createAtom, Atom } from './atom'
import { allHandlers, objectHandlers, FlowHandlers, properties } from './handlers'
import { ObjectFlow, ProxyFlow } from './index'

const handlers = Object.assign(objectHandlers, allHandlers)

export type ExtensionHandlers = {
  handlers?: FlowHandlers
  properties?: FlowHandlers
}

export function installExtension(props: ExtensionHandlers) {
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
 * Создать {@link ObjectFlow} - контейнер потока
 * @remarks
 * Минимальные функции, максимальная скорость доставки, за счёт увеличения потребления памяти.
 * Используйте {@link ObjectFlow}, когда нет возможности использовать {@link ProxyFlow}.
 * @param value - необязательное стартовое значние
 * @returns {@link ObjectFlow}
 */
export function createObjectFlow<T>(value?: T): ObjectFlow<MaybeAny<T>> {
  const atom = createAtom(...arguments)
  const flow = Object.assign(atom, objectHandlers)
  atom.proxy = flow
  return flow
}

/**
 * Создать {@link ProxyFlow} - прокси контейнера потока
 * @remarks
 * Базовые функции, максимальная скорость создания, минимальное потребление памяти.
 * @param value - необязательное стартовое значение, может быть асинхронной функцией возвращающей значение
 * @returns {@link ProxyFlow}
 */
export function createProxyFlow<T>(value?: T):ProxyFlow<MaybeAny<T>> {
  const atom = createAtom(...arguments)
  const flow = new Proxy(atom, proxyHandler)
  atom.proxy = flow
  return flow
}
