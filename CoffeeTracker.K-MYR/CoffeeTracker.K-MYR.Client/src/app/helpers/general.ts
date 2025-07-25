export function removeUndefinedValuesFromObject<T extends Record<string, any>>(obj: T): T {
  Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key]);
  return obj;
}

export function hasNoNulls<TType>(obj: any, keys: (keyof TType)[]): boolean {
  return keys.every(key => obj[key]);

}

export function mapKeys<T extends object, K extends keyof T>(source: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = source[key];
  }
  return result;
}
