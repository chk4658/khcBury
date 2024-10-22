import { MonitorVue } from "./monitor";
import Bury from "./bury";
import { BuryConfig } from "./config";
import filters from "./bury.filter";
import { buryEmit } from "./common";
import { ActionCategory, ActionType } from "./index.interface";
import { getPath } from "./path";

export default class BuryVue extends Bury {
  private route: any;

  constructor(monitor: MonitorVue, config: BuryConfig) {
    super(monitor, config);
    this.initBuriedVue(monitor);
  }

  private initBuriedVue(monitor: MonitorVue) {
    monitor.monitorRouter();
    monitor.on("Route", (payload) => {
      this.route = payload.to;

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
                  path: from.path,
                  duration: payload.duration,
                  query: payload.from.query,
                  params: payload.from.params,
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
                path: from.path,
                duration: payload.duration,
                query: payload.from.query,
                params: payload.from.params,
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
                data: {
                  path: to.path,
                  query: payload.to.query,
                  params: payload.to.params,
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
              data: {
                path: to.path,
                query: payload.to.query,
                params: payload.to.params,
              },
            }
          );
        }
      }
    });
  }

  getFilterUrl() {
    if (!this.route) return filters.urlFilter(getPath());
    else return filters.urlFilter(this.route.path, this.route);
  }
}
