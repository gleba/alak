import React from 'react'

function AtomCol({ row }) {
  const atomSelect = () => {
    console.log('selected')
  }
  return (
    <tr onClick={atomSelect}>
      {row.map(v => (
        <td className='code'>{v}</td>
      ))}
    </tr>
  )
}

const iUid = 2
const iValue = 6
const iChildren = 7

export function DebugLog({ box }) {
  //const atomRows = ABox()
  //debug && debug.forEach(c => atomRows.push(c[iUid], c))
  return (
    <table className='debug-log'>
      {/*<thead>*/}
      {/*  <tr>*/}
      {/*    <th>Atom</th>*/}
      {/*    <th className='norm'>Value</th>*/}
      {/*    <th className='norm'>Children</th>*/}
      {/*    <th className='norm'>Updates</th>*/}
      {/*  </tr>*/}
      {/*</thead>*/}
      <tbody>
        {box && box.mapAll(l => {
          return <AtomCol key={l[0] + l[1]} row={l} />
        })}
      </tbody>
    </table>
  )
}
