import {test} from "./ouput.shema"
import {isArray, isNumber, isString} from "util";
import {DFlow} from "../src";




test("level4 - Collections", (t: any) => {


    let objectFlow = DFlow({
        one: true,
        two: true
    })
    let arrayFlow = DFlow(["one", "two"])

    arrayFlow.next(function (v) {
        t.ok(v.length==1, "remove array item")
        arrayFlow.off(this)
    })

    objectFlow.next(function (v) {
            t.ok(!v.two, "remove object item")
            objectFlow.off(this)
    })
    objectFlow.remove("two")
    arrayFlow.remove("two")



    objectFlow.next(function (v) {
        t.ok(v.two, "set object item")
    })
    objectFlow.set("two", true)



    arrayFlow.set(0, "three")
    arrayFlow.push("four")
    t.ok(arrayFlow()[0]==="three", "set array item")
    t.ok(arrayFlow()[1]==="four", "push array item")

    t.ok(arrayFlow.map((i,k)=>k)[1]==1,"map array")
    t.ok(objectFlow.map((i,k)=>k).two=="two","map object")


    // console.log(arrayFlow.v)

    // arrayFlow.on(x=>{
    //     console.log("1 arrayFlow.on", x)
    // })


    arrayFlow.next(x=>{
        console.log("next effect", x)
    })

    arrayFlow.effect(v=> v.map(i => 0))
    arrayFlow.on(x=>{
        console.log("arrayFlow.on", x)
    })
    arrayFlow.mutate(v=>v)
    console.log(arrayFlow.v)
    arrayFlow.clearEffect()
    arrayFlow.each((v,i)=>{
        console.log(v,i)

    })

    t.end()

})
