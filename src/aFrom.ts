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

  const makeMix = mixFn => {
    let values = flows.map(flow => flow.value)
    let nextValues = mixFn(...values)
    if (isPromise(nextValues)) {
      nextValues.then(v => setFunctorValue(functor, v))
    } else {
      setFunctorValue(functor, nextValues)
    }
    return nextValues
  }

  function quantum(mixFn) {
    flows.forEach(flow => {
      if (flow != functor.proxy) flow.next(() => makeMix(mixFn))
    })
    makeMix(mixFn)
  }

  function holistic(mixFn, strong?: any[]) {
    return new Promise(done => {
      let needToRun = flows.length
      let waitSet = new Set()
      const countActiveFlows = f => {
        if (waitSet) waitSet.add(f)
        if (!waitSet || waitSet.size == needToRun) {
          done(makeMix(mixFn))
          waitSet = null
        }
      }
      flows.forEach(flow => {
        //for this flow in mix
        if (flow == functor.proxy) needToRun--
        else {
          if (flow.isAsync) {
            flow()
            strong && strong.push(flow)
          }
          flow.up(() => countActiveFlows(flow))
        }
      })
    })
  }
  function strong(mixFn) {
    const strongFlows = []
    functor.strongFn = () => {
      // console.log("-", holyFlows.length)
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
    holistic(mixFn, strongFlows)
  }
  return {
    quantum,
    holistic,
    strong,
  }
}
