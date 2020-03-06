import React from 'react'

function AtomCol({ row }) {
  return (
    <tr>
      <td className='code'>{row[0]}</td>
      <td className='code'>{JSON.stringify(row[1])}</td>
      <td className='code'>{row[2]}</td>
      <td className='code'>{row[3]}</td>
    </tr>
  )
}

const iUid = 2
const iId = 3
const iName = 2
const iValue = 6
const iChildren = 7
const getName = l => {
  const uid = l[iUid]
  const id = l[iId]
  const name = l[iName]
  //console.log({id})
  return id ? id : uid
}

export function DebugTable({ box }) {
  if (!box) return null
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
        {box.mapValues(tail => {
          const l = tail[tail.length - 1]
          const uid = l[iUid]
          console.log(tail)
          return <AtomCol key={uid} row={[getName(l), l[iValue], l[iChildren], tail.length]} />
        })}
      </tbody>
    </table>
  )
}
