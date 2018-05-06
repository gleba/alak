
import {IflowStarter, IAproxy} from "./def/IAproxy";
import {Aproxy} from "./Aproxy";
import {flow} from "./Aflow";

export const A = Aproxy as IAproxy
export const Al = flow as any as IflowStarter
export const DFlow = flow as any as IflowStarter
export default Aproxy as IAproxy