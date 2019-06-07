"use strict"

// npm
require("dotenv-safe").config()
const Koa = require("koa")
const session = require("koa-session") // see https://nodejs.org/api/deprecations.html#deprecations_dep0079_custom_inspection_function_on_objects_via_inspect
const mount = require("koa-mount")
const Grant = require("grant-koa")

const grant = new Grant({
  defaults: {
    // dynamic: true,
    protocol: "http",
    host: "localhost:3000",
    // state: true,
    // nonce: true,
    transport: "session",
  },
  github: {
    key: process.env.GITHUB_KEY,
    secret: process.env.GITHUB_SECRET,
    callback: "/",
  },
})
console.log("grant.config-0", grant.config)

const app = new Koa()
// REQUIRED: any session store - see /examples/koa-session-stores
app.keys = ["grant"]
app.use(session({ httpOnly: false }, app))
// mount grant
app.use(mount(grant))
console.log("grant.config-1", grant.config)

app.use((ctx) => {
  console.log("grant.config-2", grant.config)
  // console.log('ctx.session', ctx.session)
  // ignore favicon
  console.log("ctx-request", ctx.request)
  console.log("ctx-response", ctx.response)
  console.log("ctx-app", ctx.app)
  console.log("ctx-originalUrl", ctx.originalUrl)
  console.log("ctx-session", ctx.session)
  if (ctx.path === "/favicon.ico") return

  let n = ctx.session.views || 0
  ctx.session.views = ++n
  ctx.body = n + " views"
})

app.listen(3001)
console.log("listening on port 3001")
console.log("grant.config", grant.config)
