/**
 * Корневой модуль библиотеки.
 * @remarks
 * Сборка всех частей библиотеки в {@link AConstant| A} константе.
 *
 * Импорт модуля устанавливает все модули-расширения библиотеки.
 * @public
 * @packageDocumentation
 */

import { AC, AtomCreator, MaybeAny, ProxyAtom } from '../core'
import { ComputeStrategicAtom, ComputeStrategy, installComputedExtension } from '../ext-computed'

installComputedExtension()

// @ts-ignore
declare module 'alak/lib/core' {
  interface ProxyAtom<T> {
    match(...pattern: any[]): ProxyAtom<T>
    from<A extends ProxyAtom<any>[]>(...a: A): ComputeStrategy<T, A>
  }
}

type ComputedAtom<T, IN> = {}

/** Конструктор атома
 * @remarks
 * Функция-константа, расширяет {@link core#AtomCreator}
 * @example
 * ```javascript
 * const atom = A() // сокращённая запись A.proxy()
 * ```
 * */
export interface AConstant extends AtomCreator {
  <T>(value?: T): ProxyAtom<MaybeAny<T>>

  /**
   * Создать атом c функцией добытчика {@link ProxyAtom.useGetter}.
   * @remarks
   * Сокращённая запись `A().useGetter(fun)`
   * @param getterFn
   */
  getter<T>(getterFn: () => T): ProxyAtom<T>

  /**
   * Создать атом из нескольких других атомов и стратегии вычисления.
   * Смотрите описание стратегий: {@link ext-computed#ComputeStrategy}.
   * @example
   * ```javascript
   * const a1 = A(1)
   * const a2 = A(2)
   * const computedAtom = A
   *          .from(a1, a2)
   *          .some((v1, v2) => v1 + v2)
   * console.log(computedAtom()) //output:3
   * ```
   * @param atoms - набор входных атомов для вычисления значения
   * @returns {@link ext-computed#ComputeStrategy}
   */
  from<IN extends ProxyAtom<any>[]>(...atoms: IN): ComputeStrategicAtom<IN>
}
/**{@link AConstant}*/
export const A = (Object.assign(AC, {
  getter(getterFun) {
    const flow = AC.proxy()
    flow.useGetter(getterFun)
    return flow
  },
}) as any) as AConstant

export default A

A.from(A(1), A('2'))
  .quantum((a, b) => {
    console.log(a, b)
    return 2
  })
  .up(x => x)

export { ProxyAtom } from '../core'
