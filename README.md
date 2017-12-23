
### FRP DataFlow & Pattern Matching
[![npm version](https://badge.fury.io/js/alak.svg)](https://badge.fury.io/js/alak)
[![travis status](https://travis-ci.org/gleba/alak.svg?branch=master)](https://travis-ci.org/gleba/alak)
[![dependencies](https://david-dm.org/ramda/ramda.svg)](https://david-dm.org/ramda/ramda)
[![Downloads](https://img.shields.io/npm/dt/git-status.svg)](https://www.npmjs.com/package/git-status)

FRP style atomic updates.
Easy and simple fast.
Zero-dependency.
Prefect for state machines.

###### Example
```javascript
import DFlow from "alak";

const channel = DFlow()
channel.match(
    "one", console.log,
    "one", 1000, () => console.log("..."),
    "two", (a, b) => console.log(b),
    (...v) => console.log('else', v)
)

channel("there", "fo") // else [ 'there', 'fo' ]
channel("two", ["some data"]) // [ 'some data' ]
channel("one", 1000) //...
channel("one", {1: 1}) // one { '1': 1 }

```
[more](https://github.com/gleba/alak/blob/master/tests/)

## Instalation 
`npm i alak -S`

## Development
TypeScript based source 
- `npm i`
- `node dev`

## Dependencies 
- dependency-free library
- npm/yarn/lasso/e.t.c. package manager

## API

#### DFlow 
Create new channel
`DFlow function DFlow<T>(...a: T[]): DChannel<T>`
```
const startFlow = DFlow(1) 
``` 
### Data Channels property :
#### `data`
`data: T[]`
- Just get current data (never use)

#### `on`
`on(fn: Listener<T>): DChannel<T>`
- Subscribe function to data flow updates
```
startFlow.on(v => console.log("flow listener1", v))
```
#### `stop`
`stop(fn: any): void`
- Unsubscribe function from data flow updates (i never use)

#### `mutate`
`mutate(fn: (...v:T[])=>any[]): void`
- Mutate data flow value and emit channel array always
```
    s5.mutate((...v) => {        
        v[2] = false
        return v
    })

```
#### `branch`
`branch<U>(fn: (...a: any[]) => U[]): DChannel<U>`
- Create a new channel based on the current 


#### `match`
`match(...pattern: any[]): void`
- See pattern matching examples in header and bottom.


#### `end`
`end(): void;`
- Destroy. Remove all data and listeners.


###### Other Examples
```javascript
// Basic 

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

// Advanced

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
```
