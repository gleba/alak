///// <reference path="./def/index.d.ts" />
import {Aproxy} from "./Aproxy";
import {flowStarter, IAproxy} from "./def/IAproxy";
import {flow} from "./Aflow";
import {IFlow} from "./def/IFlow";


export const A = Aproxy as IAproxy
export const AFlow = flow as flowStarter
export default Aproxy as IAproxy


// export const DFlow = AFlow
