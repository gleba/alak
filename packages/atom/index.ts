/**
 * Ядро атома
 * @remarks
 * Атом - это функция-контейнер, предназначенная для множественной доставки значения контейнера
 * в дочерние функции-получатели.
 *
 * - Передача значения в функцию-атом установит значение контейнера и
 * доставит значение в функции-получатели.
 *
 * - Вызов функции-атома без аргументов - вернёт текущее
 * значение контейнера если оно есть.
 * @packageDocumentation
 */

import { createProtoAtom, createAtom } from './create'

/**
 * Опции расширения
 * @remarks
 * Содержит параметры расширения для методов и свойств атома.
 * Доступ к атому из {@link FlowHandler| функций обработчиков}  происходит через контекст `this`.
 */
export interface ExtensionOptions {
  /** {@link FlowHandlers | обработчики методов атома}
   * @remarks
   * смотрите так же: {@link FlowHandlers} и {@link FlowHandler}*/
  handlers?: FlowHandlers
  /** {@link FlowHandlers | обработчики свойств атома}
   * @remarks
   * смотрите так же: {@link FlowHandlers} и {@link FlowHandler}*/
  properties?: FlowHandlers
}

/** Функция с контекстом {@link Core | атома}
 * @remarks
 * смотрите так же: {@link ExtensionOptions}*/
export type FlowHandler = {
  (this: Core, ...a: any[]): any
}
/** Объект с обработчиками {@link FlowHandler}
 * @remarks
 * смотрите так же: {@link ExtensionOptions}*/
export type FlowHandlers = {
  [key: string]: FlowHandler
}
export { installAtomExtension } from './create'

/** {@link AtomCoreConstructor} */
export const AC: AtomCoreConstructor = Object.assign(createProtoAtom, {
  proxy: createAtom,
  proto: createProtoAtom,
})
/** Функция-контейнер*/
export type Core = {
  children: Set<AnyFunction>
  grandChildren: Map<AnyFunction, AnyFunction>
  stateListeners: Map<string, Set<AnyFunction>>
  getterFn: any
  wrapperFn: any
  meta: any
  metaMap?: Map<string, any>
  _: any
  value: any
  uid: number
  id: string
  _name: string
  haveFrom: boolean
  isEmpty: boolean
  isAsync: boolean
  isAwaiting: boolean | any
  (...a: any[]): void
}
type AnyFunction = {
  (...v: any[]): any
}
/** @internal */
export type MaybeAny<T> = unknown extends T ? any : T

/**
 * Создание прокси-атома и атома
 * @example
 * ```javascript
 * const flow = AC() // сокращённая запись AC.proxy()
 * ```
 */
export interface AtomCoreConstructor {
  /** Создать {@link Atom} с необязательным аргументом как стартовое значение*/
  <T>(value?: T): Atom<MaybeAny<T>>
  /**
   * Создать {@link Atom} с необязательным аргументом как стартовое значение
   * @remarks
   * Максимальные функции, максимальная скорость создания, минимальное потребление памяти.
   * @param value - необязательное стартовое значение
   * @returns {@link Atom}
   * @readonly
   */
  proxy<T>(value?: T): Atom<MaybeAny<T>>
  /**
   * Создать {@link Atom} с необязательным аргументом как стартовое значение
   * @remarks
   * Минимальные функции, максимальная скорость доставки значения за счёт увеличения потребления памяти.
   * @param value - необязательное стартовое значение
   * @returns {@link Atom}
   */
  proto<T>(value?: T): Atom<MaybeAny<T>>
}

type ValueReceiver<T extends any> = (v: T) => void


/** Экземпляр атома
 * @remarks
 * Функция-контейнер.
 */
export interface Atom<T> {
  /**
   * Вернуть текущее значение контейнера
   */
  (): Promise<T> | T
  /**
   * Доставить значение всем дочерним слушателям и установить новое значение в контейнер.
   * @param value устанавливаемое значние
   */
  (value?: T): T

  /** Доставить значение всем дочерним слушателям и установить новое значение в контейнер.*/
  (value?: T, ...auxiliaryValues): void

  /**
   * Вернуть текущее значение контейнера
   */
  (): Promise<T> | T

  /**
   * Текущее значение контейнера
   */
  readonly value: T
  /** Вернёт `true` при отсутствующем значении в контейнере*/
  readonly isEmpty: boolean

  /** Идентификатор, вернёт `uid` если не был задан {@link Atom.setId}*/
  readonly id: string
  /** Имя заданное {@link Atom.setName} */
  readonly name: string

  /** Уникальный идентификатор генерируется при создании.*/
  readonly uid: string
  // on: FlowStateListner
  // /** remove event listener for change async state of data, "await, ready, etc...
  //  * @experimental*/
  // off: FlowStateListner

  /** check 'from' or 'warp' function are async*/
  /** Является ли уставленный добытчик {@link Atom.useGetter} асинхронным */
  readonly isAsync: Boolean
  /** Находится ли атом в процессе получения значения от асинхронного добытчика
   * {@link Atom.useGetter}*/
  readonly isAwaiting: Boolean

  /** Добавить функцию-получатель обновлений значения контейнера
   * и передать текущее значение контейнера, если оно есть
   * @param receiver - функция-получатель
   * @returns {@link atom#Atom}*/
  up(receiver: ValueReceiver<T>): Atom<T>

  /** Добавить функцию-получатель и передать значение со следующего обновления
   * @param receiver - функция-получатель
   * @returns {@link Atom}*/
  next(receiver: ValueReceiver<T>): Atom<T>

  /** Удалить функцию-получатель
   * @param receiver - функция-получатель
   * @returns {@link atom#Atom}*/
  down(receiver: ValueReceiver<T>): Atom<T>

  /** Передать один раз в функцию-получатель значение контейнера,
   * текущее если оно есть или как появится
   * @param receiver - функция-получатель
   * @returns {@link Atom}*/
  once(receiver: ValueReceiver<T>): Atom<T>

  /** Добавить функцию-получатель значений не равных `null` и `undefined`
   * @param receiver - функция-получатель
   * @returns {@link Atom}*/
  upSome(receiver: ValueReceiver<T>): Atom<T>

  /** Добавить функцию-получатель значений равных `true`
   * после приведения значения к типу `boolean` методом `!!value`
   * @param receiver - функция-получатель
   * @returns {@link Atom}*/
  upTrue(receiver: ValueReceiver<T>): Atom<T>

  /** Добавить функцию-получатель значений равных `false`
   * после приведения значения к типу `boolean` методом `!value`
   * @param receiver - функция-получатель
   * @returns {@link Atom}*/
  upFalse(receiver: ValueReceiver<T>): Atom<T>

  /** Добавить функцию-получатель значений равных `false`
   * после приведения значения к типу `boolean` методом `!value`
   * за исключением `null` и `undefined`
   * @param receiver - функция-получатель
   * @returns {@link Atom}*/
  upSomeFalse(receiver: ValueReceiver<T>): Atom<T>

  /** Добавить функцию-получатель значений равных `null` и `undefined`
   * @param receiver - функция-получатель
   * @returns {@link Atom}*/
  upNone(receiver: ValueReceiver<T>): Atom<T>

  /** Проверить значение контейнера на соответствие
   * @param compareValue - проверяемое значение
   * @returns положительно при соответствии заданного значения значению контейнера*/
  is(compareValue: T): boolean

  /** Добавить слушатель изменения асинхронного состояния функции добычи значения {@link Atom.useGetter}
   * @param listener - функция-слушатель
   * @returns {@link Atom}*/
  onAwait(listener: (isAwaiting: boolean) => void): Atom<T>
  /** Удалить слушатель изменения асинхронного состояния
   * @param listener - функция-слушатель
   * @returns {@link Atom}*/
  offAwait(listener: AnyFunction): void
  /** Удалить связи всех функций-получателей, слушателей, и очистить значение контейнера
   * @returns {@link Atom}*/
  clear(): Atom<T>

  /** Очистить значение контейнера
   * @returns {@link atom#Atom} */
  clearValue(): Atom<T>

  /** Удалить все свойства, функции и ссылки,  {@link core#Atom}*/
  decay(): void

  /** Повторно отправить значение всем функциям-получателям
   * @returns {@link Atom} */
  resend(): Atom<T>

  /** Установить идентификатор
   * @param id - идентификатор
   * @returns {@link Atom} */
  setId(id: string): Atom<T>

  /** Установить имя
   * @param name - имя
   * @returns {@link Atom} */
  setName(name: string): Atom<T>

  /** Добавить мета-данные
   * @param metaName - название-ключ мета-данных
   * @param value - необязательное значение мета-данных
   * @returns {@link Atom} */
  addMeta(metaName: string, value?: any): Atom<T>

  /** Проверить на наличие мета-данных
   * @param metaName - имя мета-данных
   * @returns положительно при наличии мета-данных*/
  hasMeta(metaName: string): boolean

  /** Получить мета-данные по имени
   * @param metaName - имя мета-данных
   * @returns данные мета-данных*/
  getMeta(metaName: string): any

  /** Использовать функцию-добытчик значения контейнера
   * @remarks
   * Функция-добытчик вызывается каждый раз при вызове функции-атома
   * @param getter - функция-добытчик
   * @param isAsync - установить значение {@link Atom.isAsync}
   * @returns {@link Atom} */
  useGetter(getter: () => T | Promise<T>, isAsync?:boolean): Atom<T>
  /** Использовать функцию-добытчик только один раз
   * @param getter - функция-добытчик
   * @param isAsync - установить значение {@link Atom.isAsync}
   * @returns {@link Atom} */
  useOnceGet(getter: () => T | Promise<T>, isAsync?:boolean): Atom<T>

  /** Использовать функцию-обёртку
   * Каждое новое обновление значение контейнера атома,
   * всегда будет проходить сперва через функцию-обёртку
   * @param wrapper - функция-обёртка
   * @param isAsync - установить значение returns {@link Atom.isAsync}
   * @returns {@link Atom} */
  useWrapper(wrapper: (newValue: T, prevValue: T) => T | Promise<T>, isAsync?:boolean): Atom<T>

  /** Применить функцию к значению в контейнере
   * @param fun - функция принимающая текущее значение и возвращающей
   * новое значение в контейнер и дочерним функциям-получателям
   * @returns {@link Atom} */
  fmap(fun: (v: T) => T): Atom<T>

  /**
   * Создать дубликат значение
   * @remarks
   * Методом `JSON.parse(JSON.stringify(value))`
   * @returns T */
  cloneValue(): T

  /** Передаёт значение контейнера в ключ объекта
   * @param targetObject - целевой объект
   * @param key - ключ доступа к значению в объекте
   */
  injectOnce(targetObject: any, key?: string): Atom<T>
}
