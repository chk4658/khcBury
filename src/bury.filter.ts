import { urlMap } from "./map.config";

const filters = {
  clickFilter: (ele: HTMLElement) => {
    return !!ele.dataset["bury_point"];
  },
  /**
   * 判断路径是否在需要监听
   * @param path 要判断的路径
   * @returns 如果在监听的列表中，对应 path + enter + leave 对象，否则返回为undefined
   */
  urlFilter: (path: string) => {
    console.log(path, "path", urlMap);
    return {
      path: path,
      enter: path + "Enter",
      leave: path + "Leave",
    };
  },
};

export default filters;
