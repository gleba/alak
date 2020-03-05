




//const h = A.id("h-atom").getter(asyncHello)
//trace(h())
//await h()

export const codeSamples = [
  {
    id: 1,
    title: 'База',
    code: `const a = A() //создание атома
a('some things') //передача значение в атом
trace(a()) //получение значения из атома
trace(a()) //неизменно
a.up(v=> // добавление функции-получателя обновлений
  trace("update listener:", v)
)
a('Hello World')
// a('что нить ещё')
`,
  },
  {
    title: 'Асинхронность',
    code: `// В атом можно ложить функцию
const asyncGetter = () => {
  trace('call getterFn')
  return new Promise(fin => setTimeout(() => fin('hello world'), 2500))
}
const a = A.getter(asyncGetter) //создание атома с функцией-добычи значения
trace("a is:", a()) // инициализировать получение значения
a() // пока значение получается, функция геттер-повторно не вызовится
a().then(v => trace("then:",v))
await a() 
trace(a.value)`,
  },
  {
    title: 'Комбинации',
    code: `
const asyncHello = () => new Promise(fin => setTimeout(() => fin('hello'), 2500))
const asyncWorld = () => new Promise(fin => setTimeout(() => fin('word'), 500))
    
const atomA = A.id('a').getter(asyncHello)
const atomB = A.id('b').getter(asyncWorld)
const atomAB = A.id('c')
  .from(atomA, atomB)
  .some((valueA, valueB) => {
    trace("дожидаемся заполнения атомов a и b")    
`+"    return `${valueA} ${valueB}`"+`
  })
`,
  },
  {
    id: 3,
    title: 'Матчинг',
    code: `const a = A()`,
  },
]
