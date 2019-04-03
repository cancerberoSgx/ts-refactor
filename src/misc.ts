export function getEnumKeys(e: any) {
  const keys: string[] = []
  for (let i in e) {
    keys.push(e[i])
  }
  return keys
}
export function notUndefined<T>(a: T): a is Exclude<T, undefined> {
  return typeof a !== 'undefined'
}
