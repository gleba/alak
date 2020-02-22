/**
 * Корневой модуль библиотеки.
 * @remarks
 * Сборка всех частей библиотеки в {@link AConstant| A} константе.
 * Импорт модуля устанавливает модули: `computed`, `matching`.
 * @public
 * @packageDocumentation
 */

import { patternMatch } from '../ext-matching'
import { installExtension } from '../core/create'
import { AC, MaybeAny, ProxyAtom, AtomCreator } from '../core'
import { fromFlows, ComputeStrategy } from '../ext-computed'

installExtension({
  handlers: {
    match: patternMatch,
    from: fromFlows,
  },
})

// @ts-ignore
declare module 'alak/lib/core' {
  interface ProxyAtom<T> {
    match(...pattern: any[]): ProxyAtom<T>
    from<A extends ProxyAtom<any>[]>(...a: A): ComputeStrategy<T, A>
  }
}
/** Конструктор атома
 * @remarks
 * Функция-константа, расширяет {@link core#AtomCreator}
 * @example
 * ```javascript
 * const flow = A() // сокращённая запись A.proxy()
 * ```
 * */
export interface AConstant extends AtomCreator{
  <T>(value?: T): ProxyAtom<MaybeAny<T>>

  /**
   * Создать атом
   * @param fun
   */
  getter<T>(fun:()=>T):ProxyAtom<T>
}
/**{@link AConstant}*/
export const A = Object.assign(AC, {
  getter(getterFun){
    const flow = AC.proxy()
    flow.useGetter(getterFun)
    return flow
  },
}) as any as AConstant

export default A


export {ProxyAtom} from "../core"
