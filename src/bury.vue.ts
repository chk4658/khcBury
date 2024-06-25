import { MonitorVue } from "./monitor";
import Bury from "./bury";
import { BuryConfig } from "./config";
import filters from "./bury.filter";
import { buryEmit } from "./common";
import { ActionCategory, ActionType } from "./index.interface";

export default class BuryVue extends Bury {
  private readonly router: any;

  constructor(monitor: MonitorVue, config: BuryConfig) {
    super(monitor, config);
    this.router = monitor.router;
    this.initBuriedVue(monitor);
  }

  private initBuriedVue(monitor: MonitorVue) {
    monitor.monitorRouter();
    monitor.on("Route", (payload) => {
      const from = filters.urlFilter(payload.from.path, payload.from);
      const to = filters.urlFilter(payload.to.path, payload.to);
      if (from?.leave) {
        const eventId = from.leave;
        if (!this.ready) {
          this.todo.push((config: BuryConfig) => {
            buryEmit(
              { ...config, duration: payload.duration, to: payload.to, from: payload.from },
              {
                actionName: eventId,
                actionCategory: ActionCategory.Leave,
                actionType: ActionType.Leave,
                actionStartTimeLong: payload.time.getTime(),
                uiName: from.pathname,
                actionEndTimeLong: payload.time.getTime() + payload.duration,
                data: {
                  path: to.path,
                  duration: payload.duration,
                },
              }
            );
          });
        } else {
          buryEmit(
            { ...this.config, duration: payload.duration, to: payload.to, from: payload.from },
            {
              actionName: eventId,
              actionCategory: ActionCategory.Leave,
              actionType: ActionType.Leave,
              actionStartTimeLong: payload.time.getTime(),
              uiName: from.pathname,
              actionEndTimeLong: payload.time.getTime() + payload.duration,
              data: {
                path: to.path,
                duration: payload.duration,
              },
            }
          );
        }
      }
      if (to?.enter) {
        const eventId = to.enter;
        if (!this.ready) {
          this.todo.push((config: BuryConfig) => {
            buryEmit(
              { ...config, duration: payload.duration, to: payload.to, from: payload.from },
              {
                actionName: eventId,
                actionCategory: ActionCategory.Leave,
                actionType: ActionType.Leave,
                actionStartTimeLong: payload.time.getTime(),
                uiName: to.pathname,
                actionEndTimeLong: payload.time.getTime() + payload.duration,
                data: {
                  path: to.path,
                },
              }
            );
          });
        } else {
          buryEmit(
            { ...this.config, duration: payload.duration, to: payload.to, from: payload.from },
            {
              actionName: eventId,
              actionCategory: ActionCategory.Leave,
              actionType: ActionType.Leave,
              actionStartTimeLong: payload.time.getTime(),
              uiName: to.pathname,
              actionEndTimeLong: payload.time.getTime() + payload.duration,
              data: {
                path: to.path,
              },
            }
          );
        }
      }
    });
  }

  getFilterUrl() {
    return filters.urlFilter(this.router.path, this.router);
  }
}
