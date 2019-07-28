import {AFX, effects} from "./AFX";


export function setFunctorValue(functor: AFunctor, ...a) {

  if (!functor.childs){
    console.error("Attempt to pass in the killed flow ", functor.id ? functor.id : "")
    console.warn("it's possible memory leak in application")
    return
  }
  if (a.length > 0) {
    functor.value = a
  }
  notifyTheChildren(functor)
}
export function notifyTheChildren(functor:AFunctor ) {
  if (functor.childs.size > 0) {
    functor.childs.forEach(f => {
      f.apply(f, functor.value)
    })
  }
  if (functor.grandChilds.size > 0) {
    functor.grandChilds.forEach(f => {
      f.apply(f, functor.value)
    })
  }
}


export const newAFunctor = () => {
  let childs = new Set<AChildFlow>()
  let grandChilds = new Map<AChildFlow, AChildFlow>()
  const functor = function (...a) {
    if (a.length)
      setFunctorValue(functor, ...a)
    else {
      if (functor.meta && functor.meta[AFX.BornFx]) {
        return effects.run(functor, AFX.BornFx)
      }
      return functor.value
    }
  } as AFunctor
  functor.childs = childs
  functor.grandChilds = grandChilds
  functor.value = []

  return functor as AFunctor
}

export type AChildFlow = {
  (...v: any[]): any
}

export interface AFunctor {
  childs: Set<AChildFlow>
  grandChilds: Map<AChildFlow, AChildFlow>
  meta: any
  metaMap: Map<string, Set<any>>
  // metaListeners: Map<string, Set<any>>
  value: any
  id: string
  (...a: any[]): void
}
