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

export interface AxiosInterceptorManager<V> {
  use<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any): number;
  eject(id: number): void;
}

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";

export type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";

export interface AxiosRequestConfig {
  url?: string;
  [K: string]: any;
  method?: Method;
  baseURL?: string;
  transformRequest?: any;
  transformResponse?: any | any[];
  headers?: any;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: any;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  adapter?: any;
  auth?: any;
  responseType?: ResponseType;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: any | false;
  cancelToken?: any;
  decompress?: boolean;
  transitional?: any;
}

export interface AxiosInstance {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
    [K: string]: any;
  };
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
  export interface ActionPayload {
    /**
     * 监听的行为对象
     */
    origin: () => any;
    [K: string]: any;
    /**
     * 监听行为事件发生的时间
     */
    time: Date;
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
  export interface ApiPayload {
    /**
     * 监听请求事件发生的时间
     */
    time: Date;
    /**
     * 监听请求事件发生时的Url
     */
    url: string;
    /**
     * 请求的配置
     */
    config: AxiosRequestConfig;
    /**
     * 请求的方法，例如 Get 或 Post
     */
    method: Method;
    /**
     * 请求头
     */
    header: any;
  }
}
