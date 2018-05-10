const newO = v => {
  let xp

}

const dc = (value, key?, parent?) => {
  let clone
  // console.log(":", key, value)

  switch (typeof value) {
    case "object":
      // console.log("object", key, value)
      if (Array.isArray(value)) {
        clone = []
        value.forEach((i, index) => dc(i, index, clone))
      } else {
        clone = Object.create(null)
        Object.keys(value).forEach(k => dc(value[k], k, clone))
      }
      break
    default:
      // console.log("set default", value)
      clone = value
  }
  // console.log(key, value)
  if (parent) {
    // console.log("set parent && key", key)
    parent[key] = clone
  }
  return clone
}

export const deepClone = <T>(o: T): T => {
  return dc(o) as any as T
}
export const deleteParams = o => {
  Object.keys(o).forEach(k => {
    if (o[k]) o[k] = null
    delete o[k]
  })
}


export function remove(target, value) {
  target.forEach((v, i) => {
    if (v[1] == value) {
      return target.splice(i, 1);
    }

  })
  return false;
}

