import mitt from "mitt";
import { Payload, MonitorRoute, NavigationGuardNext } from "./monitor.interface";

const ex: { instance: Monitor | null } = {
  instance: null,
};

export const monitorMitt = new mitt();

export class Monitor {
  start: Date = new Date();

  /**
   * 传入需要监听的Click的特征
   */
  monitorClick(filter: (target: HTMLElement) => boolean) {
    const primaryFilter = (ele: EventTarget | null): HTMLElement | false => {
      if (ele && ele instanceof HTMLElement) {
        if (filter(ele)) {
          return ele;
        } else if (ele.localName !== "body") {
          return primaryFilter(ele.parentElement);
        }
      }
      return false;
    };
    document.body.addEventListener(
      "click",
      (e: MouseEvent) => {
        const targetElement = primaryFilter(e.target);
        if (targetElement) {
          monitorMitt.emit("Click", {
            target: targetElement,
            time: new Date(),
          });
        }
      },
      {
        passive: true,
      }
    );
  }

  monitorPage() {
    window.addEventListener("beforeunload", (e) => {
      const now = new Date();
      monitorMitt.emit("Unload", {
        duration: now.getTime() - this.start.getTime(),
        time: now,
      });
    });
  }

  on = monitorMitt.on;
}

export class MonitorVue extends Monitor {
  public router: any;

  constructor(router: any) {
    super();
    this.router = router;
  }

  monitorRouter() {
    let start = null;
    this.router.afterEach((to: MonitorRoute, from: MonitorRoute) => {
      const now = new Date();
      const duration = start ? now.getTime() - this.start.getTime() : null;
      monitorMitt.emit("Route", {
        from,
        to,
        time: now,
        duration,
      });
      this.start = now;
      start = now;
    });
  }
}

export const initMonitor = () => {
  return (ex.instance = new Monitor());
};

export const initMonitorVue = (router: { beforeEach: (guard: any) => () => void; push: any; afterEach: (guard: any) => () => void; [K: string]: any }) => {
  if (router.afterEach && router.push) {
    return (ex.instance = new MonitorVue(router));
  }
  throw new Error("initMonitorVue is supposed to received a VueRouter Instance");
};

export default ex;
