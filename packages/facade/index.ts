/**
 * Корневой модуль библиотеки.
 * @remarks
 * Сборка всех частей библиотеки в {@link AConstant| A} константе.
 *
 * Импорт модуля устанавливает все модули-расширения библиотеки.
 * @public
 * @packageDocumentation
 */

import { AC, AtomCreator, installAtomExtension, MaybeAny, Atom } from '../atom/index'
import { ComputeStrategicAtom, from, installComputedExtension } from '../ext-computed/index'
import { alive } from '../atom/utils'
import { installMatchingExtension } from '../ext-matching/index'

installComputedExtension()
installMatchingExtension()


// // @ts-ignore
// declare module 'alak/core' {
//   // @ts-ignore
//   import { ComputeStrategy } from 'alak/ext-computed'
//   interface ProxyAtom<T> {
//     match(...pattern: any[]): ProxyAtom<T>
//     from<A extends ProxyAtom<any>[]>(...a: A): ComputeStrategy<T, A>
//   }
// }
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
  <T>(value?: T): Atom<MaybeAny<T>>

  /**
   * Создать атом c предустановленным идентификатором {@link Atom.setId}.
   * @remarks
   * Сокращённая запись  `A().setId(id)`
   * @param id - идентификатор
   * @param startValue - стартовое значение
   */
  id<T>(id: string | number, startValue?:T): Atom<MaybeAny<T>>

  /**
   * Создать атом c функцией обёртки {@link Atom.useWrapper}.
   * @remarks
   * Сокращённая запись `A().useWrapper(wrapperFun)`
   * @param wrapperFun - функция-обёртка
   */
  useWrapper<T>(wrapperFun: (v:D) => T): Atom<MaybeAny<T>>
  /**
   * Создать атом c функцией добытчика {@link Atom.useGetter}.
   * @remarks
   * Сокращённая запись `A().useGetter(fun)`
   * @param getterFn - функция-добытчик
   */
  useGetter<T>(getterFn: () => T): Atom<T>

  /**
   * Создать атом c функцией добытчика {@link Atom.useGetter}.
   * @remarks
   * Сокращённая запись `A().useOnceGet(fun)`
   * @param getterFn - функция-добытчик
   */
  useOnceGet<D>(getterFn: () => D): Atom<D>

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
  from<IN extends Atom<any>[]>(...atoms: IN): ComputeStrategicAtom<IN>
}
/**{@link AConstant}*/
export const A = (Object.assign(AC, {
  useOnceGet(getterFun) {
    return A().useOnceGet(getterFun)
  },
  useGetter(getterFun) {
    const a = A()
    a.useGetter(getterFun)
    return a
  },
  useWrapper(wrapperFun) {
    return A().useWrapper(wrapperFun)
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


export { Atom } from '../atom/index'
