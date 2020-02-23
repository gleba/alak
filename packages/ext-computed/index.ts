/**
 * Расширение вычисления множеств
 * @remarks
 * импорт модуля расширяет интерфейс `ProxyAtom`
 * ```typescript
 * declare module 'alak/core' {
 *   interface ProxyAtom<T> {
 *     from<A extends ProxyAtom<any>[]>(...a: A): ComputeStrategy<T, A>
 *   }
 * }
 * ```
 * Алгоритм использования:
 *
 * - аргументами функции задаются атомы-источники вычисления
 *
 * - выбирается стратегия вычисления
 *
 * - задаётся функция-вычислитель, принимающая значения атомов-источников
 *
 * - вычисленное значение функции-вычислителя устанавливается в атом контекста
 * @example
 * ```javascript
 * const a1 = A(1)
 * const a2 = A(2)
 * const computedAtom = A()
 * computedAtom.from(a1, a2).some((v1, v2) => v1 + v2)
 * console.log(computedAtom()) //output:3
 * ```
 * @public
 * @packageDocumentation
 */

import { setAtomValue } from '../core/atom'
import { isPromise } from '../core/utils'
import { Atom, installExtension, ProxyAtom } from '../core'

/** Установить расширение вычисления множеств прокси-атома*/
export function installComputedExtension(){
  installExtension({
    handlers: {
      from: fromFlows,
    },
  })
}
// @ts-ignore
declare module 'alak/core' {
  interface ProxyAtom<T> {
    from<A extends ProxyAtom<any>[]>(...a: A): ComputeStrategy<T, A>
  }
}


type UnpackedPromise<T> = T extends Promise<infer U> ? U : T
type UnpackedFlow<T> = T extends (...args: any[]) => infer U ? U : T
type ReturnArrayTypes<IN extends any[]> = { [K in keyof IN]: UnpackedPromise<UnpackedFlow<IN[K]>> }

type FunComputeIn<T, IN extends any[]> = {
  (...a: ReturnArrayTypes<IN>): T | PromiseLike<T>
}
type ComputedIn<T, IN extends any[]> = {
  (fn: FunComputeIn<T, IN>): T
}


/**
 * Описание стратегий вычисления значения
 */
export interface ComputeStrategy<T, IN extends any[]> {
  /**
   * Функция-обработчик вызывается при заполнении всех атомов любыми значениями.
   */
  quantum: ComputedIn<T, IN>
  /**
   * Функция-обработчик вызывается при наличии значения всех атомов исключая `null` и `undefined`.
   */
  some: ComputedIn<T, IN>
  /**
   * Функция-обработчик вызывается обновлением любого атома-источника.
   */
  weak: ComputedIn<T, IN>
  /**
   * Вызвать функцию-добытчик у асинхронных атомов-источников.
   * Функция-обработчик вызывается при заполнении всех атомов любыми значениями.
   */
  strong: ComputedIn<T, IN>
}

type ComputeInOut<IN extends any[], OUT> = {
  (...v: ReturnArrayTypes<IN>): OUT
}
type ComputeAtom<IN extends any[]> = {
  <OUT>(fn: ComputeInOut<IN, OUT>): ProxyAtom<OUT>
}

/** @internal */
export type ComputeStrategicAtom<IN extends any[]> = {
  [K in keyof ComputeStrategy<any, IN>]: ComputeAtom<IN>
}

/** @internal */
export function fromFlows(...flows: ProxyAtom<any>[]) {
  const atom: Atom = this
  if (atom.haveFrom) {
    throw `atom ${
      atom.id ? atom.id : ''
    } already has a assigned 'from(flows..', reassign 'from' to attest to logic errors`
  } else {
    atom.haveFrom = true
  }
  let someoneIsWaiting = []
  const freeWaiters = v => {
    while (someoneIsWaiting.length) someoneIsWaiting.pop()(v)
  }
  const makeMix = mixFn => {
    const inAwaiting: ProxyAtom<any>[] = []
    let values = flows.map(flow => {
      if (flow.isAwaiting) {
        inAwaiting.push(flow)
      }
      return flow.value
    })
    if (inAwaiting.length > 0) {
      return new Promise(_ => someoneIsWaiting.push(_))
    }
    atom.getterFn = () => makeMix(mixFn)
    let nextValues = mixFn(...values)
    if (isPromise(nextValues)) {
      nextValues.then(v => {
        freeWaiters(v)
        setAtomValue(atom, v)
      })
    } else {
      freeWaiters(nextValues)
      setAtomValue(atom, nextValues)
    }
    return nextValues
  }

  function weak(mixFn) {
    flows.forEach(flow => {
      if (flow != atom.proxy) flow.next(() => makeMix(mixFn))
    })
    makeMix(mixFn)
  }

  function quantum(mixFn, opt?: { strong?: any[]; some?: boolean }) {
    let needToRun = flows.length
    let waitCount = 0
    let waitSet = new Set()
    return new Promise(done => {
      atom.getterFn = () => new Promise(_ => someoneIsWaiting.push(_))
      function countActiveFlows() {
        if (waitSet) {
          waitSet.add(this)
          if (waitSet.size == needToRun) {
            waitSet = null
            done(makeMix(mixFn))
          }
        } else done(makeMix(mixFn))
      }
      flows.forEach(flow => {
        //for this flow in mix
        if (flow == atom.proxy) needToRun--
        else {
          if (!opt) {
            flow.up(countActiveFlows)
          } else {
            if (opt.strong && flow.isAsync) {
              flow()
              opt.strong.push(flow)
            } else {
              waitCount++
            }
            if (opt.some) {
              flow.upSome(countActiveFlows)
            }
          }
        }
      })
    })
  }
  function strong(mixFn) {
    const strong = []
    atom.strongFn = () => {
      return new Promise(fin => {
        if (strong.length) {
          Promise.all(strong.map(f => f())).then(() => {
            fin(atom.value[0])
          })
        } else {
          return fin(makeMix(mixFn))
        }
      })
    }
    return quantum(mixFn, { strong })
  }

  function some(mixFn) {
    return quantum(mixFn, { some: true })
  }

  return {
    quantum,
    some,
    weak,
    strong,
  }
}
