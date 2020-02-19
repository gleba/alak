import { createProxyFlow } from './create'

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

  /**
   * Подписка на обновление
   * @example
   * Here's an example with negative numbers:
   * ```javascript
   * flow.up(value=>{
   *   console.log(value)
   * })
   * ```
   * @param value необязательное стартовое значние
   * @param auxiliaryValues вспомогательные значения
   */
  up<T>(fun: ValueReceiver<T>): void
}

/** Интерфейс прокси потока
 * @remarks
 * Прокси потока является функцией-контейнером
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

  /** Добавить функцию-получатель обновлений значения контейнера
   * и передать текущее значение контейнера, если оно есть
   * @param receiver - функция-получатель
   * @returns {@link ProxyFlow}*/
  up(receiver: ValueReceiver<T>): ProxyFlow<T>

  /** Добавить функцию-получатель и передать значение со следующего обновления
   * @param receiver - функция-получатель
   * @returns {@link ProxyFlow}*/
  next(receiver: ValueReceiver<T>): ProxyFlow<T>

  /** Удалить функцию-получатель
   * @param receiver - функция-получатель */
  down(receiver: ValueReceiver<T>): void

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
   * @returns {@link ProxyFlow} */
  clearValue(): ProxyFlow<T>

  /** Закрыть поток, удалить все свойства*/
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
   * @returns положительно при наличии мета-данных
   */
  hasMeta(metaName: string): boolean

  /** Получить мета-данные по имени
   * @param metaName - имя мета-данных
   * @returns данные мета-данных
   */
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

  /** pattern matching see examples https://github.com/gleba/alak/blob/master/tests/3_pattern_maching.ts*/

  /** function that takes values and returns a new value for flow*/
  mutate(mutator: (v: T) => T): void

  /** mutate computed value from multi flow https://github.com/gleba/alak/blob/master/tests/2_mutate_from.ts*/

  /** get immutable clone of value*/
  getImmutable(): T

  /** get immutable clone of value*/
  injectOnce(targetObject: any, key?: string)
}

export { createObjectFlow, createProxyFlow } from './create'
