import {test} from "./ouput.shema"
import {isArray, isNumber, isString} from "util";
import DFlow, {DInjectableFlow} from "../src";


class InjetableClass extends DInjectableFlow {
    s1 = DFlow()
    s2 = DFlow()
}


test("injectable", (t: any) => {

    const a1 = new InjetableClass()
    const a2 = new InjetableClass()


    a2.from(a1)

    a2.s1.on(v=>{
        t.ok(true, "injectable form")
    })

    a1.s1.emit()
    a1.s1(2)
})