"use strict"

// npm
require("dotenv-safe").config()
const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
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

const app = new Koa()
// REQUIRED: any session store - see /examples/koa-session-stores
app.keys = ["grant"]
app.use(session({ httpOnly: false }, app))
app.use(bodyParser())

// mount grant
app.use(mount(grant))

app.use((ctx) => {
  // console.log('ctx.session', ctx.session)
  // ignore favicon
  // console.log("ctx-request", ctx.request)
  // console.log("ctx-response", ctx.response)
  console.log("ctx-KEYS", Object.keys(ctx))
  console.log("ctx-method", ctx.method)

  console.log("ctx-app", ctx.app)
  console.log("ctx-originalUrl", ctx.originalUrl)
  console.log("ctx-session", ctx.session)
  // if (ctx.path === "/favicon.ico") return

  if (ctx.path === "/api/logout") {
    ctx.session = null
    ctx.body = { logout: true }
  }

  return
  /*
  let n = ctx.session.views || 0
  ctx.session.views = ++n
  ctx.body = n + " views"
  */
})

app.listen(3001)
console.log("listening on port 3001")
