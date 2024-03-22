export interface RouteRecordNormalized {
  path: string;
  redirect: any | undefined;
  name: any;
  components: any;
  children: Exclude<any, void>;
  meta: Exclude<any, void>;
  props: Record<string, any>;
  beforeEnter: any;
  leaveGuards: Set<any>;
  updateGuards: Set<any>;
  enterCallbacks: Record<string, any[]>;
  instances: Object;
  aliasOf?: RouteRecordNormalized;
}

export interface MonitorRoute {
  fullPath: string;
  hash: string;
  matched: RouteRecordNormalized[];
  meta: Record<string | number | symbol, unknown>;
  name?: string | symbol;
  params: Record<string, string | string[]>;
  path: string;
  query: Record<string, string | null | (string | null)[]>;
  redirectedFrom: RouteRecordNormalized;
}

export interface NavigationGuardNext {
  (): void;

  (error: Error): void;

  (location: any): void;

  (valid: boolean | undefined): void;

  (cb: any): void;
}

export namespace Payload {
  export interface ClickPayload {
    /**
     * Click事件监听的对应DOM
     */
    target: HTMLElement;
    /**
     * 监听事件发生的时间
     */
    time: Date;
  }

  export interface LoadPayload {
    /**
     * 从打开页面到关闭页面的时间间隔
     */
    duration: number;
    /**
     * 监听事件发生的时间
     */
    time: Date;
    /**
     * 监听事件发生时页面的Href（即Url地址）
     */
    href: string;
  }

  export interface RoutePayload {
    /** @type { VueRouter.RouteLocationNormalized } */
    from: MonitorRoute;
    /** @type { VueRouter.RouteLocationNormalized } */
    to: MonitorRoute;
    /**
     * 监听事件发生的时间
     */
    time: Date;
    /**
     * 在本页面等待的时间
     */
    duration: number;
  }
}
