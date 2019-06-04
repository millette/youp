"use strict"

// npm
const Koa = require("koa")
const session = require("koa-session") // see https://nodejs.org/api/deprecations.html#deprecations_dep0079_custom_inspection_function_on_objects_via_inspect
const mount = require("koa-mount")
const Grant = require("grant-koa")

const grant = new Grant({
  defaults: {
    dynamic: true,
    protocol: "http",
    host: "localhost:3000",
    // transport: "session",
  },
})
const app = new Koa()
// REQUIRED: any session store - see /examples/koa-session-stores
app.keys = ["grant"]
app.use(session(app))
// mount grant
app.use(mount(grant))

app.use((ctx) => {
  // console.log('ctx.session', ctx.session)
  // ignore favicon
  if (ctx.path === "/favicon.ico") return

  let n = ctx.session.views || 0
  ctx.session.views = ++n
  ctx.body = n + " views"
})

app.listen(3000)
console.log("listening on port 3000")
console.log("grant.config", grant.config)

// visit to http://localhost:3000/connect/github
// redirects to https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fconnect%2Fgithub%2Fcallback
