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
import { alive, isPromise } from '../core/utils'
import { Atom, installExtension, ProxyAtom } from '../core'
import { createPrivateKey } from 'crypto'

/** Установить расширение вычисления множеств прокси-атома*/
export function installComputedExtension() {
  installExtension({
    handlers: {
      from,
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
export function from(...fromAtoms: ProxyAtom<any>[]) {
  const atom: Atom = this
  if (atom.haveFrom) {
    throw `from atoms already has a assigned`
  } else {
    atom.haveFrom = true
  }
  let someoneIsWaiting = []
  const addWaiter = () => new Promise(_ => someoneIsWaiting.push(_))
  const freeWaiters = v => {
    while (someoneIsWaiting.length) someoneIsWaiting.pop()(v)
  }

  function applyValue(mixedValue) {
    if (isPromise(mixedValue)) {
      mixedValue.then(v => {
        freeWaiters(v)
        setAtomValue(atom, v)
      })
    } else {
      freeWaiters(mixedValue)
      setAtomValue(atom, mixedValue)
    }
    atom._isAwaiting && delete atom._isAwaiting
    return mixedValue
  }
  const makeMix = mixFn => {
    const inAwaiting: ProxyAtom<any>[] = []
    const { strong, some } = mixFn
    const needFull = strong || some
    let values = fromAtoms.map(a => {
      if (a.isAwaiting) {
        inAwaiting.push(a)
      } else if (needFull && !alive(a.value)) {
        inAwaiting.push(a)
      }
      return a.value
    })
    if (inAwaiting.length > 0) {
      atom.getterFn = addWaiter
      return (atom._isAwaiting = addWaiter())
    }
    atom.getterFn = () => mixFn(...values)
    return applyValue(mixFn(...values))
  }
  const linkedValues = {}
  function weak(mixFn) {
    function mixer(v) {
      const linkedValue = linkedValues[this.id]
      if (v !== linkedValue) {
        makeMix(mixFn)
        linkedValues[this.id] = v
      }
    }
    fromAtoms.forEach(a => {
      if (a !== atom.proxy) {
        linkedValues[a.id] = a.value
        a.next(mixer)
      }
    })
    makeMix(mixFn)
    return atom.proxy
  }

  function some(mixFn) {
    mixFn.some = true
    return weak(mixFn)
  }

  function strong(mixFn) {
    let mutex = false
    let firstRun = true
    let getting = {}
    function getterFn(){
      // console.log('---------')
      // console.log("getting", getting)
      const waiters = []
      mutex = true
      const values = fromAtoms.map(a => {
        let v: any = getting[a.id]
        if (v) return v
        else v = a()
        if (isPromise(v)) {
          waiters.push(a)
          // console.log(a.id, 'is promise')
          v.then(v => {
            getting[a.id] = v
            linkedValues[a.id] = v
            // console.log('resolve promise', v)
            const deepValue = getterFn()
            if (!isPromise(deepValue) &&firstRun){
              applyValue(deepValue)
              firstRun = false
            } else {
              freeWaiters(deepValue)
            }
          })
        } else {
          linkedValues[a.id] = v
        }
        return v
      })
      // console.log("waiters", waiters.length)

      if (waiters.length > 0) {
        atom.getterFn = addWaiter
        return (atom._isAwaiting = addWaiter())
      }
      atom.getterFn = getterFn
      mutex = false
      getting = {}
      return mixFn(...values)
    }

    function mixer(v) {
      const linkedValue = linkedValues[this.id]
      if (v !== linkedValue) {
        linkedValues[this.id] = v
        !mutex && atom.getterFn()
      }
    }
    fromAtoms.forEach(a => {
      if (a !== atom.proxy) {
        a.next(mixer)
      }
    })
    const firstValue = getterFn()
    if (!isPromise(firstValue)) {
      // firstValue.then(v=>{
      //   // console.log("first value")
      //   // applyValue(v)
      // })
    // } else {
      applyValue(firstValue)
    }
    return atom.proxy
  }

  return {
    some,
    weak,
    strong,
  }
}
