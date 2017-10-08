
# alak / अलक  (sanskrit)
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

![Image of alak](http://x.gleb.pw/alak.jpg)
# अलक 
## Multilanguage documentation

Please use [Google Translate](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=ru&sp=nmt4&tl=en&u=https://github.com/gleba/alak/) and your imagination, if you intersting The literary meaning of the concept of this library.

Meanings of अलक in English :
- Curl / Forelock / Sliver 
- (name of child) Beautiful Tresses
- (name of child) World 

Лучший способ выражать истинный смысл идей этой библиотеки на моём родном языке.

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

## Story / История
 Санкт-Петербургской зимой, на конференции IT Global Meetup 4 в уголке FRP, слушая рассказ [Марии](https://github.com/fprogspb/fprogspb/blob/master/past-local.org#Мария-Давыдова---Парадигмы-программирования) о движении данных в функциональных деревьях - влюбился в идею потоков. Отдельная благодарность вселенной за возможность писать в те дни на Scala. Спустя пол года я вернулся к задачам создания быстрых и простых клиентских приложений. В мире JS(ES.Next) перепробовав RxJS, Beacon, Kefir.js, atom, e.t.c. остановился на flyd больше всего отвечающей идее अलक. Создание этой библиотеки возникло от желания красивого и простого синтаксиса подписывания на поток. 
 - В августе 2016 года अलक уже использовался в несольких проектах и был выгружен в npm без какой либо документации и примеров использования. 
 - В сентябре 2017 обнаружив использование библиотеки ежемесячно более чем в 1000 проектах (!без малейшего описания!), принял решение причесать библиотеку и написать документацию. 
