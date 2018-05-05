///// <reference path="./def/index.d.ts" />
import {Aproxy} from "./Aproxy";
import {IAproxy} from "./def/IAproxy";
import {flow} from "./Aflow";
import {IAflow} from "./def/IAflow";


export const A = Aproxy as IAproxy
export const AFlow = flow
export default Aproxy as IAproxy


// export const DFlow = AFlow
