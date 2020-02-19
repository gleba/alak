import A, { createObjectFlow, createProxyFlow, ObjectFlow } from '../packages/core'



import './benchmark'


function getV() {
  return 1//new Promise(done=>done(1))
}

function xx(a) {

  return a as ReturnType<typeof getV>
}
const x = xx(getV)


const flow = createProxyFlow(1)


flow.on
flow.once(s=>s)



