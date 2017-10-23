
![Image of alak](http://x.gleb.pw/935545702ce4e52c5255a017b87a7f3d.jpg)
### FRP Library for TypeScript
[![npm version](https://badge.fury.io/js/alak.svg)](https://badge.fury.io/js/alak)
###### Example
```javascript
import {A} from "alak"

const convertedValue = A.start()
const someNum = A.start()
someNum.on(n => convertedValue(n + "kg"))
convertedValue.on(console.log)
someNum(1)
//output: 1 kg
someNum(2)
//output: 2 kg
convertedValue.stop(console.log)

const squareNum = someNum.branch(x => x * x)
squareNum.on(console.log)
someNum(7)
//output: 79
squareNum.stop(console.log)

someNum.match(
    7, v => console.log("match seven done"),
    100, v => console.log("match 100 done"),
    "*", v => console.log("match * done"),
)
//output: match seven done
someNum(100)
//output: match 100 done
someNum(3)
//output: match * done

console.log(someNum(), squareNum(), convertedValue())
//output: 3 9 '3kg'
```
[other tests here](https://github.com/gleba/alak/blob/master/tests/index.ts)

## Instalation 
`npm i alak -S`

## Development
- clone repo
- `npm i`
- `node dev`


## Dependencies 
- dependency-free library
- TypeScript
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

## Inspiration / Вдохновение
- [Functional reactive programming](https://en.wikipedia.org/wiki/Functional_reactive_programming)
- [Purely functional data structure](https://en.wikipedia.org/wiki/Purely_functional_data_structure)
- Atomic updates
- Pattern Matching
- Scala
- [awesome-frp-js](https://github.com/stoeffel/awesome-frp-js)
- [flyd](https://github.com/paldepind/flyd)