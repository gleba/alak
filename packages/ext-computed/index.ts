/**
 * Расширение вычисления множеств
 * @remarks
 * импорт модуля расширяет интерфейс `Atom`
 * ```typescript
 * declare module 'alak/core' {
 *   interface Atom<T> {
 *     from<A extends Atom<any>[]>(...a: A): ComputeStrategy<T, A>
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

import { setAtomValue } from '../atom/core'
import { alive, isPromise } from '../atom/utils'
import { Core, installAtomExtension, Atom } from '../atom/index'
import { createPrivateKey } from 'crypto'

/** Установить расширение вычисления множеств прокси-атома*/
export function installComputedExtension() {
  installAtomExtension({
    handlers: {
      from,
    },
  })
}
// @ts-ignore
declare module 'alak/core' {
  interface Atom<T> {
    from<A extends Atom<any>[]>(...a: A): ComputeStrategy<T, A>
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
  <OUT>(fn: ComputeInOut<IN, OUT>): Atom<OUT>
}

/** @internal */
export type ComputeStrategicAtom<IN extends any[]> = {
  [K in keyof ComputeStrategy<any, IN>]: ComputeAtom<IN>
}

const computedContext = 'computed'

/** @internal */
export function from(...fromAtoms: Atom<any>[]) {
  const atom: Core = this
  if (atom.haveFrom) {
    throw `from atoms already has a assigned`
  } else {
    atom.haveFrom = true
  }
  let someoneIsWaiting = []
  const addWaiter = () => new Promise(_ => someoneIsWaiting.push(_))
  const freeWaiters = v => {
    while (someoneIsWaiting.length) {
      someoneIsWaiting.pop()(v)
    }
  }

  function applyValue(mixedValue) {
    if (isPromise(mixedValue)) {
      mixedValue.then(v => {
        freeWaiters(v)
        setAtomValue(atom, v, computedContext)
      })
    } else {
      freeWaiters(mixedValue)
      setAtomValue(atom, mixedValue, computedContext)
    }
    atom.isAwaiting && delete atom.isAwaiting
    return mixedValue
  }
  const makeMix = mixFn => {
    const inAwaiting: Atom<any>[] = []
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
      return (atom.isAwaiting = addWaiter())
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
      if (a !== atom._) {
        linkedValues[a.id] = a.value
        a.next(mixer)
      }
    })
    makeMix(mixFn)
    return atom._
  }

  function some(mixFn) {
    mixFn.some = true
    return weak(mixFn)
  }

  function strong(mixFn) {
    // let firstRun = true
    let getting = {}
    function getterFn() {
      // console.log('---------')
      // console.log('getting', getting)
      const waiters = {}
      const isWaiting = ()=> Object.keys(waiters).length
      const values = fromAtoms.map(a => {
        let v: any = getting[a.uid]
        if (v) return v
        else v = a()
        if (isPromise(v)) {
          waiters[a.uid] = true
          // console.log(a.id, 'is promise', isWaiting())
          v.then(v => {
            getting[a.uid] = v
            linkedValues[a.uid] = v
            delete waiters[a.uid]
            // console.log(a.id, 'resolve', isWaiting())
            if (!isWaiting()) {
              const deepValue = getterFn()
              if (!isPromise(deepValue)) {
                freeWaiters(deepValue)
              }
            }
          })
        } else {
          linkedValues[a.uid] = v
        }
        return v
      })

      if (isWaiting()) {
        atom.getterFn = addWaiter
        return (atom.isAwaiting = addWaiter())
      }
      atom.getterFn = getterFn
      getting = {}
      // console.log('mix')
      return mixFn(...values)
    }

    function mixer(v) {
      const linkedValue = linkedValues[this.id]
      if (v !== linkedValue) {
        linkedValues[this.id] = v
      }
    }
    fromAtoms.forEach(a => {
      if (a !== atom._) {
        a.next(mixer)
      }
    })
    atom.getterFn = () => {
      return getterFn()
    }
    return atom._
  }

  return {
    some,
    weak,
    strong,
  }
}
