import {test} from "./ouput.shema"
import {isArray, isNumber, isString} from "util";
import AFlow, {DInjectableFlow} from "../src";


class InjetableClass extends DInjectableFlow {
    s1 = AFlow()
    s2 = AFlow()
}


test("InjetableClass", (t: any) => {

    const a1 = new InjetableClass()
    const a2 = new InjetableClass()


    a2.from(a1)

    a2.s1.on(v=>{
        t.ok(true, "form")
    })

    a1.s1.emit()
    a1.s1(2)

})