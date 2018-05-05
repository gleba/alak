/** @autor Gleb Panteleev <dev@gleb.pw> */
import {AFlow} from "../src";

// import AFlow from "../src";

//base usage

const startFlow = AFlow(1)

startFlow.on(v => console.log("flow listener1", v))
startFlow.on(v => console.log("flow listener2", v))
startFlow.on(v => console.log("flow listener3", v))

startFlow.match(
    4, v => console.log("pattern match by key", v)
)


// output for :
startFlow(10)
startFlow(4)

// flow listener1 10
// flow listener2 10
// flow listener3 10
// flow listener1 4
// flow listener2 4
// flow listener3 4
// pattern match by key 4

startFlow.drop() //remove all listeners

const multiple = startFlow.branch((...v) => v.map(i => i * 2) as any)
multiple.match((a, b) => [
        a > 10, () => console.log("fn pattern match", a),
        a < 0 && b == "wow", () => console.log("!WOW!", a, b),
        (...v) => console.log("else çall", v)

    ]
)
startFlow(161) //fn pattern match 322
multiple(-4, "wow") //!WOW! -4 wow
startFlow(0, 1, 2, 3) //else çall [ 0, 2, 4, 6 ]
multiple(1, 1, 1, 1) //else çall [ 1, 1, 1, 1 ]


//
// const channel = AFlow()
// channel.match(
//     "one", console.log,
//     "one", 1000, () => console.log("..."),
//     "two", (a, b) => console.log(b),
//     (...v) => console.log('else', v)
// )
//
// channel("there", "fo") // else [ 'there', 'fo' ]
// channel("two", ["some data"]) // [ 'some data' ]
// channel("one", 1000) //...
// channel("one", {1: 1}) // one { '1': 1 }