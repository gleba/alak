/** @autor Gleb Panteleev <dev@gleb.pw> */


import {A} from "../src/index";

const convertedValue = A.start()
const someNum = A.start()
someNum.on(n => convertedValue(n + "kg"))
convertedValue.on(console.log)
someNum(1)
//output: 1 kg
someNum(2)
//output: 2 kg
convertedValue.stop(console.log)


const squareFn = x => x * x
const squareNum = someNum.branch(squareFn)
squareNum.on(console.log)
someNum(7)
//output: 79
console.log(convertedValue())
//output: 7kg
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