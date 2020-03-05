import React from 'react'

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
    mapAll(iterator) {
      return Object.values(values).map(v=>iterator(v))
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

function AtomCol({row}) {
  const atomSelect = () => {
    console.log('selected')
  }
  return (
    <tr onClick={atomSelect}>
      <td>{row[0]}</td>
      <td>{row[1]}</td>
      <td>{row[2]}</td>
      <td>{row[3]}</td>
      {/*<td>ч</td>*/}
    </tr>
  )
}

const iUid = 2
const iValue = 6
const iChildren = 7

export function DebugTable({ debug }) {

  const atomRows = ABox()
  debug && debug.forEach(c => atomRows.push(c[iUid], c))
  return (
    <table>
      <thead>
        <tr>
          <th>Atom</th>
          <td>Value</td>
          <td>Children</td>
          <td>Updates</td>
        </tr>
      </thead>
      <tbody>
        {atomRows.mapAll(tail => {
          const l = tail[tail.length-1]
          const uid = l[iUid]
          return <AtomCol key={uid} row={[uid, l[iValue], l[iChildren], tail.length]} />
        })}
      </tbody>
    </table>
  )
}
