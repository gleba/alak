const A = require('./alak')


let stream1 = A.start()
let stream2 = A.start()

stream1.on(console.log)
stream1("stream1 subscribe ok")


A.mix(stream1, stream2).on(
    r=> {
        console.log("mix", r.length)
    }
)

stream2("stream2 1")
//stream2("stream1 2")

stream1.on(
    data=> {
        console.log("new subsribe", data);
    }
)

//let sa = A.new("sss")
//sa.on(console.log)
//
//sa.emit("xxx!")


let fut = A.once(
    done=> {
        setTimeout(
            ()=> {
                done(1000)
            }, 1000
        )
    }
);

fut.on(x=>{
    console.log("done",x)
    console.log("fut",fut());
    setTimeout(()=>{
        console.log("fut",fut);
    },1000)
})