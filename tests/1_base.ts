import { test } from './ouput.shema'
import { A } from '../packages/core'



test('base functions', ({ ok, end, fall, plan }) => {
  //start
  const flow = A(5)
  flow.up(v => ok(v == 5, 'up'))

  //clear
  flow.next(v => fall('next after clear should be never called'))
  flow.clear()
  flow.up(v => fall('up after clear should be never called'))
  console.log(flow.value)

  ok(flow.value == undefined, 'clear')

  //next and up
  flow.clear()
  flow(3)
  flow.next(v => ok(v == 5, 'next'))
  flow(5)
  flow.up(v => ok(v == 5, 'up fill newFlow'))

  //atomic updates
  const countFlow = A()
  let vCounter = 0
  const addCount = v => (vCounter = vCounter + v)
  countFlow.up(addCount)
  countFlow.up(addCount)
  countFlow(10)
  ok(vCounter === 10, 'up only one link of handler')
  countFlow.up(v => addCount(v))
  countFlow.up(v => addCount(v))
  ok(vCounter === 30, 'up multiple handlers')

  //down
  countFlow.down(addCount)
  countFlow(1)
  ok(vCounter === 32, 'down')

  //notify
  flow.clear()
  flow.up(() => ok(true, 'notify'))
  flow.notify()

  //check empty
  flow.clear()
  ok(flow.isEmpty, 'isEmpty')
  flow(undefined)
  ok(!flow.isEmpty, 'is not empty')
  flow.clearValue()
  ok(flow.isEmpty, 'is empty again')

  //once
  flow.clear()
  flow.once(v => ok(v == 1, 'once'))
  flow(1)
  flow(2)
  flow(3)

  countFlow.close()
  ok(countFlow() == undefined, 'close')
  countFlow(5) //error message test

  plan(13)
  end()
})
