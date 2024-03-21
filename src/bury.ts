import { Monitor } from "./monitor";
import initConfig, { BuryConfig } from "./config";
import filters from "./bury.filter";
import { BuryCallBackPayload } from "./index.interface";
import { buryEmit, buryEmitter } from "./common";

export default class Bury {
  on = (callback: (value: BuryCallBackPayload) => void) => buryEmitter.on("bury", callback);

  config: BuryConfig = {};
  private monitor: Monitor;
  private isSpy: boolean = false;
  protected todo: ((config: BuryConfig) => void)[] = [];

  protected ready = false;

  constructor(monitor: Monitor, config: BuryConfig) {
    this.monitor = monitor;
    this.init(monitor, config);
  }

  private init(monitor: Monitor, defaultConfig: BuryConfig) {
    this.overrideEventListeners();
    initConfig(defaultConfig).then((res) => {
      Object.assign(this.config, res);
      this.ready = true;
      const to = filters.urlFilter(window.location.pathname);
      if (to?.enter) {
        const eventId = to.enter;
        buryEmit("Enter", this.config, eventId);
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
      console.log(payload, this.ready, this.todo, this.config, payload.target, payload.target.innerText, "----");
      const eventId = payload.target.dataset["bupoint"] as string;
      if (!this.ready) {
        this.todo.push((config: BuryConfig) => {
          buryEmit("Click", config, eventId, payload);
        });
      } else {
        buryEmit("Click", this.config, eventId, payload);
      }
    });
  }

  private onUnload() {
    this.monitor.on("Unload", (payload) => {
      const from = filters.urlFilter(window.location.pathname);
      if (from?.leave) {
        const eventId = from.leave;
        if (!this.ready) {
          this.todo.push((config: BuryConfig) => {
            buryEmit("Leave", config, eventId, payload);
          });
        } else {
          buryEmit("Leave", this.config, eventId, payload);
        }
      }
    });
  }

  spy() {
    if (this.isSpy) return;
    buryEmitter.on("bury", (payload) => {
      console.log(payload.type, payload);
    });
    this.isSpy = true;
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
