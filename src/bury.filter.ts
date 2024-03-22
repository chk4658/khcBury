import { urlMap } from "./map.config";

const filters = {
  clickFilter: (ele: HTMLElement) => {
    return !!ele.dataset["bupoint"];
  },
  /**
   * 判断路径是否在需要监听
   * @param path 要判断的路径
   * @returns 如果在监听的列表中，对应 path + enter + leave 对象，否则返回为undefined
   */
  urlFilter: (path: string) => {
    return urlMap.find((item) => {
      // return pathToRegexp(item.path).test(path)
      return item.path === path;
    });
  },
};

export default filters;
