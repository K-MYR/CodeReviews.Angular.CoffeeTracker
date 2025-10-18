import { ParamMap } from "@angular/router";

export function removeUndefinedValuesFromObject<T extends Record<string, any>>(obj: T): T {
  Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key]);
  return obj;
}

export function hasNoNulls<TType>(obj: any, keys: (keyof TType)[]): boolean {
  return keys.every(key => obj[key]);
}

export function hasNoNullsFromMap<TType>(map: ParamMap, keys: (keyof TType & string)[]): boolean {
  return keys.every(key => map.has(key));
}

export function getPropertyFromMap<TType>(map: ParamMap, key: keyof TType & string): string | null {
  return map.get(key);
}

export function stringIsNullOrEmpty(text: string|null|undefined): boolean {
  return text == null || text === "";
}
