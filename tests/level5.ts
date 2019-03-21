import {test} from "./ouput.shema"
import {isArray, isNumber, isString} from "util";
import {DFlow} from "../src";




test("level4 - Collections", (t: any) => {


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

    t.end()

})
