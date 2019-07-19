import {test} from "./ouput.shema"
import {isArray, isNumber, isString} from "util";
import {DFlow} from "../src";




test("level5 - Once Warp Mix", (t: any) => {





    let arrayFlow = DFlow(["one", "two"])
    arrayFlow.once(function (v) {
        t.ok(v.length==2, "once event")
    })
    arrayFlow.remove("two")
    arrayFlow.remove("two")


    let oflow = <any>DFlow({
        one: true,
        two: true
    })
    oflow.wrap((newValue, old)=>{
        Object.keys(old).forEach(k=>{
            newValue[k] = old[k]
        })
        return newValue
    })
    oflow({four:true})
    t.ok(oflow.v.four && oflow.v.one, "wrap")


    let flow1 = DFlow()
    let flow2 = DFlow()
    let flow3 = DFlow()


    let mixed = DFlow()

    flow2(2)
    mixed.iMix(flow1,flow2, (f1,f2)=>{
        return f1+f2
    })
    flow1(1)

    t.ok(mixed.v==3, "integralMix")


    let mixed2 = DFlow()
    mixed2.iMix([flow1,flow2, flow3], (f1,f2,f3)=>{
        return f1+f2+f3
    })
    flow3(3)


    console.log(flow1.isValue(flow1()))

    t.ok(mixed2.v==6, "integralMix 2")
    t.end()

})
