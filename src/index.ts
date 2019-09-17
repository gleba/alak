
import {AFacadeProxy} from "./aFacadeProxy";
import {flow} from "./Aflow";
import {Facade, FlowStarter} from "../index";

export {FlowState} from "./FlowState";

export const A = AFacadeProxy as Facade

export const Al = flow as any as FlowStarter
export const DFlow = flow as any as FlowStarter
export default AFacadeProxy as Facade

