export function removeUndefinedValuesFromObject<T extends Record<string, any>>(obj: T): T {
  Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key]);
  return obj;
}
