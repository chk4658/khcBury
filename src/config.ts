export interface BuryConfig {
  eventId?: string;
  timestamp?: string;
  ua?: string;
  browser?: "MSIE" | "Firefox" | "Safari" | "Chrome" | "Opera";
  isPhone?: "phone" | "pc";
  pageUrl?: string;
  pageStayTime?: string;
  [K: string]: string;
}

let config: BuryConfig = {};

async function initBuryConfig(loadConfig: BuryConfig) {
  config.ua = navigator.userAgent;
  config.browser = (() => {
    let aKeys: ("MSIE" | "Firefox" | "Safari" | "Chrome" | "Opera")[] = ["MSIE", "Firefox", "Safari", "Chrome", "Opera"],
      sUsrAg = navigator.userAgent,
      nIdx = aKeys.length - 1;
    for (nIdx; nIdx > -1 && sUsrAg.indexOf(aKeys[nIdx]) === -1; nIdx--);
    return aKeys[nIdx];
  })();
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    config.isPhone = "phone";
  } else {
    config.isPhone = "pc";
  }
  Object.assign(config, loadConfig);
  return config;
}

export default initBuryConfig;
