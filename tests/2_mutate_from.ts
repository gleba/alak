import { test } from './ouput.shema'
import { A } from '../packages'

test('mutate and computate', async ({ ok, end, plan, pass }) => {
  //mutate
  const startValue = [1]
  const arrayFlow = A(startValue)
  arrayFlow.mutate(v => {
    ok(v == startValue, 'mutate')
    v.push(2)
    return v
  })
  ok(arrayFlow.value[1] == 2, 'mutate 0')

  arrayFlow.mutate(v => [24, ...v])
  ok(arrayFlow.value[0] == 24, 'mutate 1')

  arrayFlow.mutate(v => (v.pop(), v))
  ok(arrayFlow.value.length == 2, 'mutate 2')

  //from weak
  const numberFlow = A<number>()
  const computedFlow = A()
  computedFlow.from(arrayFlow, numberFlow).weak((value, newValue) => {
    if (!newValue) {
      pass('from quantum init')
      return 0
    } else {
      return value.length + newValue
    }
  })

  computedFlow.next(v => ok(v == 5, 'from quantum next'))
  numberFlow(3)

  //from holistic
  arrayFlow.clearValue()
  computedFlow.clear()
  computedFlow.from(arrayFlow, numberFlow).quantum((value, newValue) => {
    return value.length + newValue
  })
  ok(computedFlow.isEmpty, 'from holistic')
  arrayFlow([0, 0])
  ok(computedFlow.value === 5, 'from holistic five')

  //async from quantum
  computedFlow.clear()
  computedFlow.up(v => {
    ok(v == 5, 'async five')
  })
  const sum = (ar, num) => new Promise(done => setTimeout(() => done(ar.length + num), 300))
  computedFlow.from(arrayFlow, numberFlow).quantum(sum)
  ok(computedFlow.isEmpty, 'async from is empty')

  plan(10)
  setTimeout(end, 400)
})
