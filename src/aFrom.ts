import { AFlow } from '../index'
import { AFunctor, setFunctorValue } from './aFunctor'
import { isPromise } from './utils'

export function aFromFlows(functor: AFunctor, ...flows: AFlow<any>[]) {
  if (functor.haveFrom) {
    throw `functor ${
      functor.id ? functor.id : ''
    } already has a assigned 'from(flows..', reassign 'from' to attest to logic errors`
  } else {
    functor.haveFrom = true
  }
  let someoneIsWaiting = []
  const freeWaiters = v => {
    while (someoneIsWaiting.length) someoneIsWaiting.pop()(v)
  }
  const makeMix = mixFn => {
    const inAwaiting: AFlow<any>[] = []
    let values = flows.map(flow => {
      if (flow.inAwaiting) {
        inAwaiting.push(flow)
      }
      return flow.value
    })
    if (inAwaiting.length > 0) {
      return new Promise(_ => someoneIsWaiting.push(_))
    }
    functor.getterFn = () => makeMix(mixFn)
    let nextValues = mixFn(...values)
    if (isPromise(nextValues)) {
      nextValues.then(v => {
        freeWaiters(v)
        setFunctorValue(functor, v)
      })
    } else {
      freeWaiters(nextValues)
      setFunctorValue(functor, nextValues)
    }
    return nextValues
  }

  function weak(mixFn) {
    flows.forEach(flow => {
      if (flow != functor.proxy) flow.next(() => makeMix(mixFn))
    })
    makeMix(mixFn)
  }

  function quantum(mixFn, strong?: any[]) {
    let needToRun = flows.length
    let waitCount = 0
    let waitSet = new Set()
    return new Promise(done => {
      functor.getterFn = () => new Promise(_ => someoneIsWaiting.push(_))
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
        if (flow == functor.proxy) needToRun--
        else {
          if (strong && flow.isAsync) {
            flow()
            strong.push(flow)
          } else {
            waitCount++
          }
          flow.up(countActiveFlows)
        }
      })
    })
  }
  function strong(mixFn) {
    const strongFlows = []
    functor.strongFn = () => {
      return new Promise(fin => {
        if (strongFlows.length) {
          Promise.all(strongFlows.map(f => f())).then(() => {
            fin(functor.value[0])
          })
        } else {
          return fin(makeMix(mixFn))
        }
      })
    }
    return quantum(mixFn, strongFlows)
  }

  return {
    quantum,
    holistic: quantum,
    weak,
    strong,
  }
}
