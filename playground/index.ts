import './benchmark'
import A from '../packages/facade'

const a = A(1)
const b = A('')
const c = A.from(a, b)
  .some((v1, v2) => v1 + v2)

c.value
