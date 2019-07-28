
import {AFacadeProxy} from "./aFacadeProxy";
import {flow} from "./Aflow";
import {IAproxy, IflowStarter} from "../index";

export {AFX} from "./AFX";

export const A = AFacadeProxy as IAproxy

export const Al = flow as any as IflowStarter
export const DFlow = flow as any as IflowStarter
export default AFacadeProxy as IAproxy

