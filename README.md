
### FRP DataFlow & Pattern Matching
[![npm version](https://badge.fury.io/js/alak.svg)](https://badge.fury.io/js/alak)
[![travis status](https://travis-ci.org/gleba/alak.svg?branch=master)](https://travis-ci.org/gleba/alak)
[![dependencies](https://david-dm.org/ramda/ramda.svg)](https://david-dm.org/ramda/ramda)
[![Downloads](https://img.shields.io/npm/dt/git-status.svg)](https://www.npmjs.com/package/git-status)
###### Example
```javascript
import DFlow from "alak";

const startFlow = DFlow(1)

startFlow.on(v => console.log("flow listener1", v))
startFlow.on(v => console.log("flow listener2", v))
startFlow.on(v => console.log("flow listener3", v))
startFlow.match(
    4, v => console.log("pattern match by key", v)
)

startFlow(10)
startFlow(4)
// output:
// flow listener1 10
// flow listener2 10
// flow listener3 10
// flow listener1 4
// flow listener2 4
// flow listener3 4
// pattern match by key 4

startFlow.drop() //remove all listeners

const multiple = startFlow.branch(v => v * 2 as any)
multiple.match((a, b) => [
        a > 10, () => console.log("fn pattern match", a),
        a < 0 && b == "wow", () => console.log("!WOW!", a, b),
        (...v) => console.log("else çall", v)

    ]
)
startFlow(161) //fn pattern match 322
multiple(-4, "wow") //!WOW! -4 wow
startFlow(0, 0, 0, 0) //else çall [ 0 ]
multiple(1, 1, 1, 1) //else çall [ 1, 1, 1, 1 ]
```
[more](https://github.com/gleba/alak/blob/master/tests/)

## Instalation 
`npm i alak -S`

## Development
TypeScript based source
- clone repo
- `npm i`
- `node dev`


## Dependencies 
- dependency-free library
- npm/yarn/lasso/e.t.c. package manager

## Meanings of alak / अलक  (sanskrit)

Meanings of अलक in English :
- Curl / Forelock / Sliver 
- (name of child) Beautiful Tresses
- (name of child) World 

Значение अलक на Русском : 
- Локоны / Виться / Пряди  
- (имя ребёнка) Красивые завитки
- (имя ребёнка) Приятная вселенная

## Inspiration 
- [Functional reactive programming](https://en.wikipedia.org/wiki/Functional_reactive_programming)
- [Purely functional data structure](https://en.wikipedia.org/wiki/Purely_functional_data_structure)
- Atomic updates
- Pattern Matching
- Scala
- [awesome-frp-js](https://github.com/stoeffel/awesome-frp-js)
- [flyd](https://github.com/paldepind/flyd)