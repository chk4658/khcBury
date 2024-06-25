import { initMonitor, initMonitorVue, Monitor, MonitorVue } from "./monitor";
import Bury from "./bury";
import BuryVue from "./bury.vue";
import { BuryConfig } from "./config";
import { BuryCallBackPayload, headersParams, RequestPayload } from "./index.interface";

export { initUrlMap } from "./map.config";

const ex: { instance: Bury | null } = {
  instance: null,
};

export default class KhcBury {
  static ExistedBury = new Set();

  static init = (
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

  static tracked = (payload: RequestPayload) => {
    if (ex.instance) {
      return ex.instance.tracked(payload);
    } else {
      throw new Error("Monitor should be init first | 你可能没有初始化Bury实例");
    }
  };

  static sendBury = (params: RequestPayload, headers: headersParams, url: string) => {
    KhcBury.ExistedBury.add(params.actionName);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(params),
    })
      .then()
      .catch();
  };

  static onBury = (callback: (value: BuryCallBackPayload) => void) => {
    if (ex.instance) {
      return ex.instance.on(callback);
    } else {
      throw new Error("Monitor should be init first | 你可能没有初始化Bury实例");
    }
  };
}
