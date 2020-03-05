import React from 'react'


function AtomCol({row}) {
  return (
    <tr >
      <td className='code'>{row[0]}</td>
      <td className='code'>{row[1]}</td>
      <td className='code'>{row[2]}</td>
      <td className='code'>{row[3]}</td>
    </tr>
  )
}

const iUid = 2
const iValue = 6
const iChildren = 7

export function DebugTable({ box }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Atom</th>
          <th className='norm'>Value</th>
          <th className='norm'>Children</th>
          <th className='norm'>Updates</th>
        </tr>
      </thead>
      <tbody>
        {box && box.mapValues(tail => {
          const l = tail[tail.length-1]
          const uid = l[iUid]
          console.log(tail)

          return <AtomCol key={uid} row={[uid, l[iValue], l[iChildren], tail.length]} />
        })}
      </tbody>
    </table>
  )
}
