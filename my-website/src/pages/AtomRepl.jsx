import React from 'react'
import { MirrorRepl } from './Mirror'

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

export function AtomRepl(props) {
  function codeChange(code) {
    console.log({ code })
  }
  return (
    <>
      <MirrorRepl code={props.code} onChange={codeChange} />
      <div className='atom-stats'>
        {/*<div className='log'>*/}
          <pre>
            {JSON.stringify({
              x:1,
              y:3
            }, null, 2)}
          </pre>
        {/*</div>*/}
        <table >
          <thead>
            <td>Atom</td>
            <td>Value</td>
            <td>Childs</td>
            <td>Updates</td>
          </thead>
          <tbody>
            {[0, 2, 3, 4, 5].map(i => (
              <AtomCol key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
