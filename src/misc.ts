export function getEnumKeys(e: any) {
  const keys: string[] = []
  for (let i in e) {
    keys.push(e[i])
  }
  return keys
}
