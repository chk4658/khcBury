export function getPath() {
  if (window.location.hash) return window.location.hash.slice(1);
  else return window.location.pathname;
}
