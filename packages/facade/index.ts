/**
 * Корневой модуль библиотеки.
 * @remarks
 * Сборка всех частей библиотеки в {@link AConstant| A} константе.
 *
 * Импорт модуля устанавливает все модули-расширения библиотеки.
 * @public
 * @packageDocumentation
 */

import { AC, AtomCreator, installExtension, MaybeAny, ProxyAtom } from '../core'
import { ComputeStrategicAtom, from, installComputedExtension } from '../ext-computed'
import { alive } from '../core/utils'
import { installMatchingExtension } from '../ext-matching'

installComputedExtension()
installMatchingExtension()

// @ts-ignore
declare module 'alak/core' {
  import { ComputeStrategy } from '../ext-computed'
  interface ProxyAtom<T> {
    match(...pattern: any[]): ProxyAtom<T>
    from<A extends ProxyAtom<any>[]>(...a: A): ComputeStrategy<T, A>
  }
}
// installExtension({
//   handlers: {
//     from: fromFlows,
//   },
// })
/** Конструктор атома
 * @remarks
 * Функция-константа, расширяет {@link core#AtomCreator}
 * @example
 * ```javascript
 * const atom = A() // сокращённая запись A.proxy()
 * ```
 * */
export interface AConstant<D> extends AtomCreator {
  <T>(value?: T): ProxyAtom<MaybeAny<T>>

  /**
   * Создать атом c предустановленным идентификатором {@link ProxyAtom.setId}.
   * @remarks
   * Сокращённая запись  `A().setId(id)`
   * @param id - идентификатор
   * @param startValue - стартовое значение
   */
  id<T>(id: string | number, startValue?:T): ProxyAtom<MaybeAny<T>>

  /**
   * Создать атом c функцией обёртки {@link ProxyAtom.setWrapper}.
   * @remarks
   * Сокращённая запись `A().setWrapper(wrapperFun)`
   * @param wrapperFun - функция-обёртка
   */
  wrap<T>(wrapperFun: (v:D) => T): ProxyAtom<MaybeAny<T>>

  /**
   * Создать атом, с контейнерем не запоминающием значение.
   * {@link ProxyAtom.setStateless}.
   * @remarks
   * Сокращённая запись `A().setStateless()`
   */
  stateless(bool?:boolean): ProxyAtom<MaybeAny<D>>
  /**
   * Создать атом c функцией добытчика {@link ProxyAtom.setGetter}.
   * @remarks
   * Сокращённая запись `A().setGetter(fun)`
   * @param getterFn - функция-добытчик
   */
  getter<T>(getterFn: () => T): ProxyAtom<T>

  /**
   * Создать атом c функцией добытчика {@link ProxyAtom.setGetter}.
   * @remarks
   * Сокращённая запись `A().setOnceGet(fun)`
   * @param getterFn - функция-добытчик
   */
  getOnce<D>(getterFn: () => D): ProxyAtom<D>

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
  getOnce(getterFun) {
    return A().setOnceGet(getterFun)
  },
  getter(getterFun) {
    const a = A()
    a.setGetter(getterFun)
    return a
  },
  wrap(wrapperFun) {
    return A().setWrapper(wrapperFun)
  },
  stateless() {
    return A().setStateless()
  },
  from(...atoms){
    const a = A()
    return (a as any).from(...atoms)
  },
  id(id, v) {
    const a = A().setId(id)
    alive(v) && a(v)
    return  a
  }
}) as any) as AConstant<any>

export default A


export { ProxyAtom } from '../core'
