export const urlMap: {
  path: string;
  enter?: string;
  leave?: string;
}[] = [];

export function initUrlMap(
  map: {
    path: string;
    enter?: string;
    leave?: string;
  }[]
) {
  urlMap.push(...map);
}
