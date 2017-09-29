import {A} from "../src/index";

import {test} from "./ouput.shema";


test("Alak test", t => {

    let s1 = A.start(5, 8)
    s1.on((v1, v2) => {
        t.equal(v1, 5, "s1 v1");
        t.equal(v2, 8, "s2 v2");
    })

    let s2 = A.start()
    s2.on(x => {
        t.ok(x == 4, "s2");
    })
    s2(4)

    let s3 = A.start(1)
    s3.on(x => {
        t.ok(true, "s3:" + x);
    })
    s3(2)
    s3(3)

    let s4 = A.start()
    s4.match(
        3, x => t.ok(3 == x, "s4:maching"),
        "*", x => t.ok(true, "s4:maching is any", x)
    )

    s4(3)
    s4("8")

})


