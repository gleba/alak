const A = require('./index')


let stream1 = A.A.start(false)
let stream2 = A.A.start(true)

//stream1.on(console.log)
//stream1.once(x=>console.log("::::once ",x))


A.A.mix(stream1, stream2).on(
    A.A.matchFn(
        [[true, true], (v) => console.log("allok", v)],
        ["*", (v) => console.log("*")]
    )
)


stream2.match(
    false, (v) => console.log("v2", v),
    true, (v)=>console.log("v2.", v)
)

stream2(true)
stream2(false)

stream1(false)
stream1(false)
stream1(true)
//stream1( false)
//
//
//stream2( true)
//stream2( false)
//stream1( true)
//stream2( false)
//
//


//
//
//A.mix(stream1, stream2).on(
//    r=> {
//        console.log("mix", r.length)
//    }
//)
//
//stream2("stream2 1")
////stream2("stream1 2")
//
//stream1.on(
//    data=> {
//        console.log("new subsribe", data);
//    }
//)
//
////let sa = A.new("sss")
////sa.on(console.log)
////
////sa.emit("xxx!")
//
//
//let fut = A.once(
//    done=> {
//        setTimeout(
//            ()=> {
//                done(1000)
//            }, 1000
//        )
//    }
//);
//
//fut.on(x=>{
//    console.log("done",x)
//    console.log("fut",fut());
//    setTimeout(()=>{
//        console.log("fut",fut);
//    },1000)
//})