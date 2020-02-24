export const alive = v => (v !== undefined && v !== null) as boolean
export const isTruth = v => !!v
export const noneFilter = f => v => (!alive(v) ? f(v) : null)
export const someFilter = f => v => (alive(v) ? f(v) : null)
export const trueFilter = f => v => (isTruth(v) ? f(v) : null)
export const someFalseFilter = f => v => ((alive(v) && !isTruth(v)) ? f(v) : null)
export const falseFilter = f => v => (!isTruth(v) ? f(v) : null)


export const deepClone = v => (typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v)

export const deleteParams = o => {
  // console.log("→→→→", typeof o, o)
  Object.keys(o).forEach(k => {
    if (o[k]) o[k] = null
    delete o[k]
  })
}

export function remove(target, value) {
  target.forEach((v, i) => {
    if (v[1] == value) {
      return target.splice(i, 1)
    }
  })
  return false
}

export function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}
