const A = require('./index')


let stream1 = A.start()
let stream2 = A.start()

stream1.on(console.log)
stream1("stream1 subscribe ok")



A.mix(stream1,stream2).on(r=>{
    console.log("mix",r.length)
})

stream2("stream2 1")
//stream2("stream1 2")

stream1.on(
    data=> {
        console.log("new subsribe", data);
    }
)