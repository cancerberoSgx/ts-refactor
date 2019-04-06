const a = 'a' + 2 + 'b' + 'c' + `${Math.PI}`

const b = `${a} b c ${Math.PI} g ${function() {
  return 1
}.toString()}`
