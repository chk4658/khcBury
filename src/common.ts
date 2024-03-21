import { Payload as monitorPayload } from "./monitor.interface";
import mitt from "mitt";
import { BuryConfig } from "./config";
import { BuryCallBackPayload } from "./index.interface";

type Payload = monitorPayload.ClickPayload | monitorPayload.LoadPayload | monitorPayload.RoutePayload;

export const initBuryCallbackPayload = (type: "Click" | "Leave" | "Enter", config: BuryConfig, eventId: string, payload?: Payload): BuryCallBackPayload => {
  const defaultValue = {
    type,
    payload: {
      ...config,
      eventId,
      pageUrl: window.location.pathname,
      timestamp: payload?.time.getTime().toString() ?? new Date().getTime().toString(),
    },
    extra: payload,
  };
  if (type === "Click") {
    return defaultValue;
  } else if (type === "Enter") {
    return defaultValue;
  } else if (type === "Leave") {
    const p = payload as monitorPayload.RoutePayload | monitorPayload.LoadPayload;
    defaultValue.payload.pageStayTime = p.duration.toString();
    return defaultValue;
  }
};

export const buryEmitter = mitt<{
  bury: BuryCallBackPayload;
}>();

export const buryEmit = (type: "Click" | "Leave" | "Enter", config: BuryConfig, eventId: string, payload?: Payload) => {
  buryEmitter.emit("bury", initBuryCallbackPayload(type, config, eventId, payload));
};
