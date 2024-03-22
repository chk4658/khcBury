import { Payload } from "./monitor.interface";
import { BuryConfig } from "./config";

export interface BuryCallBackPayload {
  type: "Click" | "Leave" | "Enter";
  payload: BuryConfig;
  extra?: Payload.ClickPayload | Payload.LoadPayload | Payload.RoutePayload;
}
