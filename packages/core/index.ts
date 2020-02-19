import { createProxyFlow } from './create'

type ValueReceiver<T extends any> = (value: T, ...auxiliaryValues: any[]) => void

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

/** Полные функции контейнера потока
 * @remark
 * * @example
 * Here's an example with negative numbers:
 * ```javascript
 * flow.up(value=>{
 *   console.log(value)
 * })
 * Доставить значение всем дочерним слушателям и установить новое значение в контейнер.
 */
export interface ProxyFlow<T> {
  /** Доставить значение всем дочерним слушателям и установить новое значение в контейнер.*/
  (value?: T, ...auxiliaryValues): void

  /**
   * Вызов
   */
  (): Promise<T> | T

  /**
   * Значение
   */
  value: T

  /** {@inheritDoc ObjectFlow.up} */
  up<T>(fun: ValueReceiver<T>): void
}

export { createObjectFlow } from './create'
