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
  console.log('installComputedExtension')

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
export function from(...fromAtoms: ProxyAtom<any>[]) {
  const atom: Atom = this
  if (atom.haveFrom) {
    throw `atom ${
      atom.id ? atom.id : ''
    } already has a assigned 'from(atoms..', reassign 'from' to attest to logic errors`
  } else {
    atom.haveFrom = true
  }
  let someoneIsWaiting = []
  const addWaiter = () => new Promise(_ => someoneIsWaiting.push(_))
  const freeWaiters = v => {
    while (someoneIsWaiting.length) someoneIsWaiting.pop()(v)
  }
  const makeMix = mixFn => {
    const inAwaiting: ProxyAtom<any>[] = []
    const some = mixFn.some
    let values = fromAtoms.map(a => {
      if (a.isAwaiting) {
        inAwaiting.push(a)
      }
      if (some && !alive(a.value)) {
        inAwaiting.push(a)
      }
      return a.value
    })
    // console.log(inAwaiting.length)

    if (inAwaiting.length > 0) {
      atom.getterFn = addWaiter
      return atom._isAwaiting = addWaiter()
    }
    // atom.getterFn = () => makeMix(mixFn)
    atom.getterFn = () => makeMix(mixFn)
    let nextValues = mixFn(...values)
    // console.log({ nextValues })

    if (isPromise(nextValues)) {
      nextValues.then(v => {
        freeWaiters(v)
        setAtomValue(atom, v)
      })
    } else {
      freeWaiters(nextValues)
      setAtomValue(atom, nextValues)
    }
    atom._isAwaiting = false
    return nextValues
  }

  function weak(mixFn) {
    fromAtoms.forEach(a => {
      if (a !== atom.proxy) a.next(() => makeMix(mixFn))
    })
    makeMix(mixFn)
  }

  function quantum(mixFn, opt?: { fromAtoms?: any[]; some?: boolean }) {
    mixFn.some = true
    const mixer = ()=> makeMix(mixFn)
    fromAtoms.forEach(a => {
      if (opt.fromAtoms) {
        a()
        opt.fromAtoms.push(a)
      }
      a.next(mixer)
    })
    mixer()
    return atom.proxy
  }

  function strong(mixFn) {
    const fromAtoms = []
    atom.strongFn = () => {
      return new Promise(resolve => {
        if (fromAtoms.length) {
          Promise.all(fromAtoms.map(a => a())).then(() => {
            resolve(atom.value[0])
          })
        } else {
          return resolve(makeMix(mixFn))
        }
      })
    }
    return quantum(mixFn, { fromAtoms })
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
