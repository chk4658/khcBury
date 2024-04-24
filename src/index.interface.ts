import { BuryConfig } from "./config";

export interface BuryCallBackPayload {
  responseParams: RequestPayload;
  extra: BuryConfig;
}

export enum ActionCategory {
  Action = "ACTION",
  Enter = "UI_NAVI",
  Leave = "STAY_DURATION",
}

export enum ActionType {
  Blur = "BLUR",
  Choose = "CHOOSE",
  Click = "CLICK",
  Drag = "DRAG",
  Input = "INPUT",
  Scroll = "SCROLL",
  Leave = "STAY_DURATION",
  Enter = "UI_NAVI",
}

export enum Env {
  Prod = "prod",
  Test = "test",
  Dev = "dev",
}

export interface RequestPayload {
  eventId?: string;
  appName?: string;
  userNTAcct?: string;
  actionCategory?: ActionCategory;
  actionType?: ActionType;
  actionStartTimeLong?: number;
  actionEndTimeLong?: number;
  uiName?: string;
  actionName?: string;
  actionServerAPI?: string;
  data?: {
    [K: string]: any;
    buryVersion?: string;
  };
  env?: Env;
}
