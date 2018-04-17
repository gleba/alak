import {test} from "./ouput.shema"
import {isArray, isNumber, isString} from "util";
import AFlow, {A, AFlow, DInjectableFlow} from "../src";


test("weak", (t: any) => {


  let w1 = AFlow(0)




  setInterval(()=>{
    console.log("-")
    w1(Math.random())
    global.gc()
  },1000)

  let o = {
    f:v=>{
      console.log(v)

    },
    z(){
      setInterval(()=>{
        console.log("z")
        global.gc()
      },1000)
    }
  }

  // w1.weakOn(o.f)

  o.z()
  // delete o.f
  // o = null

})