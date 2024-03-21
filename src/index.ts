import { initMonitor, initMonitorVue, Monitor, MonitorVue } from "./monitor";
import Bury from "./bury";
import BuryVue from "./bury.vue";
import { BuryConfig } from "./config";
import { BuryCallBackPayload } from "./index.interface";

export { initUrlMap } from "./map.config";

const ex: { instance: Bury | null } = {
  instance: null,
};

export const init = (
  config: BuryConfig,
  router?: {
    beforeEach: (guard: any) => () => void;
    push: any;
    afterEach: (guard: any) => () => void;
    [K: string]: any;
  }
) => {
  if (router) {
    const monitor: MonitorVue = initMonitorVue(router);
    return (ex.instance = new BuryVue(monitor, config));
  }
  const monitor: Monitor = initMonitor();
  return (ex.instance = new Bury(monitor, config));
};

export const onBury = (callback: (value: BuryCallBackPayload) => void) => {
  if (ex.instance) {
    return ex.instance.on(callback);
  } else {
    throw new Error("Monitor should be init first | 你可能没有初始化Bury实例");
  }
};
