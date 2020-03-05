export function ABox() {
  const values = {}
  const all = []
  return {
    each(key, iterator) {
      let ar = values[key]
      if (ar) {
        ar.forEach(iterator)
      }
    },
    mapValues(iterator) {
      return Object.values(values).map(iterator)
    },
    mapAll(iterator) {
      return all.map(iterator)
    },
    push(key, value) {
      all.push(value)
      let ar = values[key]
      if (ar) {
        ar.push(value)
      } else {
        values[key] = [value]
      }
    },
    removeAll(key) {
      delete values[key]
    },
    has(key) {
      return !!values[key]
    },
    get(key) {
      return values[key]
    },
    size() {
      return [all.length, Object.keys(values).length]
    },
    all() {
      return Object.keys(values).length
    },
    remove(key, value) {
      let ar = values[key]
      if (ar && ar.length) {
        ar.splice(ar.indexOf(value), 1)
      }
      if (!ar.length) {
        delete values[key]
      }
    },
  }
}
