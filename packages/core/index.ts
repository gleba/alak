import { createObjectFlow, createProxyFlow } from './create'

/**
 * Опции расширения
 * @remarks
 * Содержит два параметра для методов и свойств атома
 */
export type ExtensionOptions = {
  handlers?: FlowHandlers
  properties?: FlowHandlers
}

/*обработчик потока*/
export type FlowHandler = {
  (this: Atom, ...a: any[]): any
}
export type FlowHandlers = {
  [key: string]: FlowHandler
}
export {installExtension} from './create'


/** {@link AtomCreator} */
export const AC: AtomCreator = Object.assign(createProxyFlow, {
  proxy: createProxyFlow,
  object: createObjectFlow,
})
/** Функция-контейнер*/
export type Atom = {
  /** функции слушатели обновления значения */
  children: Set<AnyFunction>
  grandChildren: Map<AnyFunction, AnyFunction>
  stateListeners: Map<string, Set<AnyFunction>>
  getterFn: any
  wrapperFn: any
  meta: any
  // metaSet: Set<string>
  metaMap?: Map<string, any>
  proxy: any
  value: any
  uid?: number
  id?: string
  flowName?: string
  haveFrom?: boolean
  isAsync?: boolean
  inAwaiting?: boolean
  strongFn?: Function
  (...a: any[]): void
}
/**
 * Интерфейс создания атома
 */
export interface AtomCreator {
  /**
   * Создать {@link ProxyFlow} - прокси контейнера потока
   * @remarks
   * Базовые функции, максимальная скорость создания, минимальное потребление памяти.
   * @param value - необязательное стартовое значение, может быть асинхронной функцией возвращающей значение
   * @returns {@link ProxyFlow}
   */
  proxy()
  /**
   * Создать {@link ObjectFlow} - контейнер потока
   * @remarks
   * Минимальные функции, максимальная скорость доставки, за счёт увеличения потребления памяти.
   * Используйте {@link ObjectFlow}, когда нет возможности использовать {@link ProxyFlow}.
   * @param value - необязательное стартовое значние
   * @returns {@link ObjectFlow}
   */
  object()
}

type ValueReceiver<T extends any> = (value: T) => void

/**
 * Основные функции контейнера потока
 */
export declare interface ObjectFlow<T> {
  /**
   * Вызов функции потока без аргументов вернёт текущее значение контейнера
   */
  (): Promise<T> | T
  /**
   * Доставить значение всем дочерним слушателям потока и установить новое значение в контейнер.
   * @param value устанавливаемое значние
   */
  (value?: T): T

  /** {@inheritDoc ProxyFlow.up} */
  up<T>(fun: ValueReceiver<T>): ObjectFlow<T>
  /** {@inheritDoc ProxyFlow.down} */
  down(receiver: ValueReceiver<T>): ObjectFlow<T>
  /** {@inheritDoc ProxyFlow.close} */
  close(): void
  /** {@inheritDoc ProxyFlow.clear} */
  clear(): ObjectFlow<T>
}

/** Интерфейс прокси потока
 * @remarks
 * Прокси поток - является функцией-контейнером
 * аргумент которой устанавливает значение контейнера
 * и передаёт значение всем функциям-слушателям.
 * Вызов функции без аргументов - вернёт значение контейнера.
 */
export interface ProxyFlow<T> {
  /** Доставить значение всем дочерним слушателям и установить новое значение в контейнер.*/
  (value?: T, ...auxiliaryValues): void

  /**
   * Вызов функции потока без аргументов вернёт текущее значение контейнера
   */
  (): Promise<T> | T

  /**
   * Текущее значение контейнера
   */
  value: T
  /** Вернёт `true` при отсутствующем значении в контейнере*/
  isEmpty: boolean
  /** Идентификатор потока, вернёт `uid` если не был задан {@link ProxyFlow.setId()}*/
  id: string
  /** Имя потока, заданное {@link ProxyFlow.setName()} */
  name: string

  /** Уникальный идентификатор потока, генерируется при создании.*/
  uid: string
  // on: FlowStateListner
  // /** remove event listener for change async state of data, "await, ready, etc...
  //  * @experimental*/
  // off: FlowStateListner
  /** check 'from' or 'warp' function are async*/
  /** Является ли уставленный добытчик {@link ProxyFlow.useGetter} асинхронным */
  isAsync: Boolean
  /** Находится ли поток в процессе получения значения от асинхронного добытчика
   * {@link ProxyFlow.useGetter}*/
  inAwaiting: Boolean

  /** Добавить функцию-получатель обновлений значения контейнера
   * и передать текущее значение контейнера, если оно есть
   * @param receiver - функция-получатель
   * @returns {@link core#ProxyFlow}*/
  up(receiver: ValueReceiver<T>): ProxyFlow<T>

  /** Добавить функцию-получатель и передать значение со следующего обновления
   * @param receiver - функция-получатель
   * @returns {@link ProxyFlow}*/
  next(receiver: ValueReceiver<T>): ProxyFlow<T>

  /** Удалить функцию-получатель
   * @param receiver - функция-получатель
   * @returns {@link core#ProxyFlow}*/
  down(receiver: ValueReceiver<T>): ProxyFlow<T>

  /** Передать один раз в функцию-получатель значение контейнера,
   * текущее если оно есть или как появится
   * @param receiver - функция-получатель
   * @returns {@link ProxyFlow}*/
  once(receiver: ValueReceiver<T>): ProxyFlow<T>

  /** Добавить функцию-получатель значений не равных `null` и `undefined`
   * @param receiver - функция-получатель
   * @returns {@link ProxyFlow}*/
  upSome(receiver: ValueReceiver<T>): ProxyFlow<T>

  /** Добавить функцию-получатель значений равных `true`
   * после приведения значения к типу `boolean` методом `!!value`
   * @param receiver - функция-получатель
   * @returns {@link ProxyFlow}*/
  upTrue(receiver: ValueReceiver<T>): ProxyFlow<T>

  /** Добавить функцию-получатель значений равных `null` и `undefined`
   * @param receiver - функция-получатель
   * @returns {@link ProxyFlow}*/
  upNone(receiver: ValueReceiver<T>): ProxyFlow<T>

  /** Проверить значение контейнера на соответствие
   * @param compareValue - проверяемое значение
   * @returns положительно при соответствии заданного значения значению контейнера*/
  is(compareValue: T): boolean

  /** Добавить слушатель изменения асинхронного состояния функции добычи значения {@link ProxyFlow.useGetter}
   * @param listener - функция-слушатель
   * @returns {@link ProxyFlow}*/
  onAwait(listener: (isAwaiting: boolean) => void): ProxyFlow<T>
  /** Удалить слушатель изменения асинхронного состояния
   * @param listener - функция-слушатель
   * @returns {@link ProxyFlow}*/
  offAwait(listener: AnyFunction): void
  /** Удалить связи всех функций-получателей, слушателей, и очистить значение контейнера
   * @returns {@link ProxyFlow}*/
  clear(): ProxyFlow<T>

  /** Очистить значение контейнера
   * @returns {@link core#ProxyFlow} */
  clearValue(): ProxyFlow<T>

  /** Закрыть поток, удалить все свойства {@link core#ProxyFlow}*/
  close(): void

  /** Повторно отправить значение всем функциям-получателям
   * @returns {@link ProxyFlow} */
  resend(): ProxyFlow<T>

  /** Установить идентификатор потока
   * @param id - идентификатор
   * @returns {@link ProxyFlow} */
  setId(id: string): ProxyFlow<T>

  /** Установить имя потока
   * @param name - имя
   * @returns {@link ProxyFlow} */
  setName(name: string): ProxyFlow<T>

  /** Добавить мета-данные
   * @param metaName - название-ключ мета-данных
   * @param value - необязательное значение мета-данных
   * @returns {@link ProxyFlow} */
  addMeta(metaName: string, value?: any): ProxyFlow<T>

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
   * Функция-добытчик вызывается каждый раз при вызове функции-потока
   * @param getter - функция-добытчик
   * @returns {@link ProxyFlow} */
  useGetter(getter: () => T | Promise<T>): ProxyFlow<T>

  /** Использовать функцию-обёртку
   * Каждое значение переданное в функцию-потока, обновление контейнера, перед
   * @param wrapper
   * @returns {@link ProxyFlow} */
  useWrapper(wrapper: (newValue: T, prevValue: T) => T | Promise<T>): ProxyFlow<T>

  /** Применить функцию к значению в контейнере
   * @param fun - функция принимающая текушее значение и возвращающей новое зачение в поток
   * @returns {@link ProxyFlow} */
  fmap(fun: (v: T) => T): ProxyFlow<T>

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
  injectOnce(targetObject: any, key?: string): ProxyFlow<T>
}
