import { MonitorVue } from "./monitor";
import Bury from "./bury";
import { BuryConfig } from "./config";
import filters from "./bury.filter";
import { buryEmit } from "./common";
import { ActionCategory, ActionType } from "./index.interface";

export default class BuryVue extends Bury {
  constructor(monitor: MonitorVue, config: BuryConfig) {
    super(monitor, config);
    this.initBuriedVue(monitor);
  }

  private initBuriedVue(monitor: MonitorVue) {
    monitor.monitorRouter();
    monitor.on("Route", (payload) => {
      const from = filters.urlFilter(payload.from.path);
      const to = filters.urlFilter(payload.to.path);
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
            }
          );
        }
      }
    });
  }
}
