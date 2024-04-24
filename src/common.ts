import mitt from "mitt";
import { BuryConfig } from "./config";
import { BuryCallBackPayload, RequestPayload } from "./index.interface";
import { v4 } from "uuid";

type Payload = RequestPayload;

export const initBuryCallbackPayload = (config: BuryConfig, payload?: Payload): BuryCallBackPayload => {
  const responseParams: RequestPayload = {
    eventId: v4(),
    ...payload,
    data: {
      ...payload.data,
      buryVersion: "v2",
    },
  };
  return {
    responseParams,
    extra: {
      ...config,
    },
  };
};

export const buryEmitter = mitt<{
  bury: BuryCallBackPayload;
}>();

export const buryEmit = (config: BuryConfig, payload?: Payload) => {
  buryEmitter.emit("bury", initBuryCallbackPayload(config, payload));
};
