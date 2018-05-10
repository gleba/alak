

const dc = (t, o, p = "") =>{
  Object.keys(o).forEach(k => {
    let v = o[k]
    // console.log(p)
    switch (typeof v) {
      case "object":
        let xo
        if (Array.isArray(v)){
          xo = t[k] = []
        } else {
          xo = t[k] = Object.create(null)
        }
        dc(xo, v, p + "." + k)
        break
      default:
        t[k] = o[k]
    }
  })
  return t
}

export const deepClone = <T>(o: T): T => {
  return dc(Object.create(null), o) as any as T
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

