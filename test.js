const A = require('./index')



let stream1 = A.A.start(true)
let stream2 = A.A.start(false)

stream1.on(console.log)
//stream1.once(x=>console.log("::::once ",x))

stream1( true)
stream1( false)
stream1( true)
stream1( false)

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