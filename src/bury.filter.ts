import { MonitorRoute } from "./monitor.interface";

const filters = {
  clickFilter: (ele: HTMLElement) => {
    return !!ele.dataset["buryId"];
  },
  /**
   * 判断路径是否在需要监听
   * @param path 要判断的路径
   * @param route
   * @returns 如果在监听的列表中，对应 path + enter + leave 对象，否则返回为undefined
   */
  urlFilter: (path: string, route?: MonitorRoute) => {
    if (path === "/" || !path) return undefined;
    let pathname = path.startsWith("/") ? path.substring(1) : path;

    const title = route?.meta?.title || route?.name || pathname;
    return {
      path,
      pathname: `${route ? title : pathname}`,
      enter: `${title}Enter`,
      leave: `${title}Leave`,
    };
  },
};

export default filters;
