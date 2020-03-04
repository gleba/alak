import React, { useCallback, useEffect, useMemo, useState } from 'react'

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

function AtomCol() {
  const atomSelect = () => {
    console.log('selected')
  }
  return (
    <tr onClick={atomSelect}>
      <td>x</td>
      <td>x</td>
      <td>x</td>
      <td>x</td>
    </tr>
  )
}

const iUid = 2
const iValue = 3
const iChildren = 7

export function DebugTable({ debug, head }) {

  const atomRows = ABox()
  debug && debug.forEach(c => atomRows.push(c[iUid], c))
  console.log("zz", atomRows.size())

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
        {[0, 2, 3, 4, 5].map(i => (
          <AtomCol key={i} />
        ))}
      </tbody>
    </table>
  )
}
