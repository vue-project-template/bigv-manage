const ctx = require.context('./', false, /\.router\.js$/)

let components = []

ctx.keys().forEach(key => components.push(ctx(key).default))

export default components