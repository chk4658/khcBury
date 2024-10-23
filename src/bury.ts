import { Monitor } from "./monitor";
import initConfig, { BuryConfig } from "./config";
import filters from "./bury.filter";
import { ActionCategory, ActionType, BuryCallBackPayload, RequestPayload } from "./index.interface";
import { buryEmit, buryEmitter, initBuryCallbackPayload } from "./common";
import { getPath } from "./path";

export default class Bury {
  on = (callback: (value: BuryCallBackPayload) => void) => buryEmitter.on("bury", callback);

  config: BuryConfig = {};
  protected monitor: Monitor;
  protected todo: ((config: BuryConfig) => void)[] = [];

  protected ready = false;

  constructor(monitor: Monitor, config: BuryConfig) {
    this.monitor = monitor;
    this.init(monitor, config);
  }

  getFilterUrl() {
    return filters.urlFilter(getPath());
  }

  private init(monitor: Monitor, defaultConfig: BuryConfig) {
    this.overrideEventListeners();
    initConfig(defaultConfig).then((res) => {
      Object.assign(this.config, res);
      this.ready = true;
      const to = this.getFilterUrl();
      if (to?.enter) {
        const eventId = to.enter;
        buryEmit(this.config, {
          actionCategory: ActionCategory.Enter,
          actionType: ActionType.Enter,
          actionName: eventId,
          actionStartTimeLong: new Date().getTime(),
          uiName: to.pathname,
          data: {
            path: to.path,
          },
        });
      }
      this.todo.map((item) => item(res));
      this.todo.length = 0;
    });
    monitor.monitorPage();
    monitor.monitorClick(filters.clickFilter);
    this.onClick();
    this.onUnload();
    return buryEmitter;
  }

  private onClick() {
    this.monitor.on("Click", (payload) => {
      const eventId = payload.target.dataset["buryId"] as string;
      const position = payload.target.dataset["buryPosition"] || "";
      const innerText = (payload.target.innerText || "").slice(0, 100);
      const u = this.getFilterUrl();
      if (!this.ready) {
        this.todo.push((config: BuryConfig) => {
          buryEmit(
            { ...config, target: payload.target },
            {
              actionName: eventId,
              actionCategory: ActionCategory.Action,
              actionType: ActionType.Click,
              actionStartTimeLong: new Date().getTime(),
              uiName: `${u.pathname}${position ? "_" : ""}${position}`,
              data: {
                path: u.path,
                innerText,
              },
            }
          );
        });
      } else {
        buryEmit(
          { ...this.config, target: payload.target },
          {
            actionName: eventId,
            actionCategory: ActionCategory.Action,
            actionType: ActionType.Click,
            actionStartTimeLong: new Date().getTime(),
            uiName: `${u.pathname}${position ? "_" : ""}${position}`,
            data: {
              path: u.path,
              innerText,
            },
          }
        );
      }
    });
  }

  private onUnload() {
    this.monitor.on("Unload", (payload) => {
      const from = this.getFilterUrl();
      if (from?.leave) {
        const eventId = from.leave;
        if (!this.ready) {
          this.todo.push((config: BuryConfig) => {
            buryEmit(
              { ...config, duration: payload.duration },
              {
                actionName: eventId,
                actionCategory: ActionCategory.Leave,
                actionType: ActionType.Leave,
                actionStartTimeLong: payload.time - payload.duration,
                uiName: from.pathname,
                actionEndTimeLong: payload.time,
                data: {
                  path: from.path,
                  duration: payload.duration,
                },
              }
            );
          });
        } else {
          buryEmit(
            { ...this.config, duration: payload.duration },
            {
              actionName: eventId,
              actionCategory: ActionCategory.Leave,
              actionType: ActionType.Leave,
              actionStartTimeLong: payload.time - payload.duration,
              uiName: from.pathname,
              actionEndTimeLong: payload.time,
              data: {
                path: from.path,
                duration: payload.duration,
              },
            }
          );
        }
      }
    });
  }

  tracked(payload: RequestPayload) {
    const u = this.getFilterUrl();
    if (payload && payload.actionName && u) {
      const position = payload.uiName || "";
      buryEmitter.emit(
        "bury",
        initBuryCallbackPayload(this.config, {
          ...payload,
          actionCategory: payload.actionCategory || ActionCategory.Action,
          actionType: payload.actionType || ActionType.Click,
          actionStartTimeLong: new Date().getTime(),
          uiName: `${u.pathname}${position ? "_" : ""}${position}`,
        })
      );
    }
  }

  overrideEventListeners() {
    (function () {
      "use strict";

      // save the original methods before overwriting them
      (Element.prototype as any)._addEventListener = Element.prototype.addEventListener;
      (Element.prototype as any)._removeEventListener = Element.prototype.removeEventListener;

      /**
       * [addEventListener description]
       * @param {[type]}  type       [description]
       * @param {[type]}  listener   [description]
       * @param {Boolean} useCapture [description]
       */
      Element.prototype.addEventListener = function (type, listener, useCapture = false) {
        // declare listener
        this._addEventListener(type, listener, useCapture);

        if (!this.eventListenerList) this.eventListenerList = {};
        if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

        // add listener to  event tracking list
        this.eventListenerList[type].push({ type, listener, useCapture });
      };

      /**
       * [removeEventListener description]
       * @param  {[type]}  type       [description]
       * @param  {[type]}  listener   [description]
       * @param  {Boolean} useCapture [description]
       * @return {[type]}             [description]
       */
      Element.prototype.removeEventListener = function (type, listener, useCapture = false) {
        // remove listener
        this._removeEventListener(type, listener, useCapture);

        if (!this.eventListenerList) this.eventListenerList = {};
        if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

        // Find the event in the list, If a listener is registered twice, one
        // with capture and one without, remove each one separately. Removal of
        // a capturing listener does not affect a non-capturing version of the
        // same listener, and vice versa.
        for (let i = 0; i < this.eventListenerList[type].length; i++) {
          if (this.eventListenerList[type][i].listener === listener && this.eventListenerList[type][i].useCapture === useCapture) {
            this.eventListenerList[type].splice(i, 1);
            break;
          }
        }
        // if no more events of the removed event type are left,remove the group
        if (this.eventListenerList[type].length == 0) delete this.eventListenerList[type];
      };

      /**
       * [getEventListeners description]
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      (Element.prototype as any).getEventListeners = function (type) {
        if (!this.eventListenerList) this.eventListenerList = {};

        // return requested listeners type or all them
        if (type === undefined) return this.eventListenerList;
        return this.eventListenerList[type];
      };
    })();
  }
}
