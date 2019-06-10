"use strict"

// npm
require("dotenv-safe").config()
const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const session = require("koa-session") // see https://nodejs.org/api/deprecations.html#deprecations_dep0079_custom_inspection_function_on_objects_via_inspect
const mount = require("koa-mount")
const Grant = require("grant-koa")
const grantProviders = Object.keys(require("grant/config/oauth.json"))
const level = require("level")
const profile = require("grant-profile").koa()

const callback = "/api/welcome"

const elDb = level("my-db", { valueEncoding: "json" })

const store = {
  get: (key, maxAge, { rolling }) => {
    console.log("get-key", key)
    console.log("get-maxAge", maxAge)
    console.log("get-rolling", rolling)
    return elDb.get(key).then((x) => {
      console.log("get-cb", JSON.stringify(x, null, "  "))
      return x
    })
  },
  set: (key, sess, maxAge, { rolling, changed }) => {
    console.log("set-key", key)
    console.log("set-sess", sess)
    console.log("set-maxAge", maxAge)
    console.log("set-rolling", rolling)
    console.log("set-changed", changed)
    return elDb.put(key, sess)
  },
  destroy: (key) => {
    console.log("destroy-key", key)
    return elDb.del(key)
  },
}

const grantConfig = {
  defaults: {
    protocol: "http",
    host: "localhost:3000",
    transport: "session",
    callback,
  },
}

grantProviders.forEach((provider) => {
  if (!grantConfig[provider]) grantConfig[provider] = {}
})

const grant = new Grant(grantConfig)
const app = new Koa()
app.keys = ["grant"]
// app.use(session({ httpOnly: false }, app))
// app.use(session(app))
app.use(session({ store, prefix: "session:" }, app))
app.use(bodyParser())
app.use(mount(grant))
app.use(profile(grantConfig))

const areEnabled = () => {
  const enabled = []
  let r
  for (r in grant.config) {
    if (r === "defaults") continue
    const { key, secret } = grant.config[r]
    if (key && secret) enabled.push(r)
  }
  return { enabled }
}

app.use((ctx) => {
  if (ctx.request.path === "/api/enabled") {
    ctx.body = areEnabled()
  }

  if (ctx.request.path === "/api/fixer") {
    console.log("grant.config", grant.config)
    grant.config.github.key = process.env.GITHUB_KEY
    grant.config.github.secret = process.env.GITHUB_SECRET
    console.log("grant.config", grant.config)
    ctx.body = grant.config
  }

  if (ctx.request.path === callback) {
    // console.log("ctx.session.grant", ctx.session && ctx.session.grant)
    if (ctx.session && ctx.session.grant) {
      console.log("ctx.session", ctx.session.grant)
      // ctx.cookies.set('koa:sess', null, { sign: true })
      // ctx.session = null
      /*
      const raw = ctx.session.grant.response.raw
      if (raw.error) {
        ctx.session = null
        // ctx.cookies.set('koa:sess')
        ctx.cookies.set('token')
        ctx.body = raw
        return
      }
      // ctx.cookies.set('koa:sess')
      ctx.cookies.set('token', ctx.session.grant.response.access_token, { httpOnly: false })
      ctx.session = null
      */
      return ctx.response.redirect("/")
    }
    // ctx.cookies.set('koa:sess')
    // ctx.cookies.set('token')
    ctx.body = { err: "no-session" }
  }

  if (ctx.request.path === "/api/logout" && ctx.request.method === "POST") {
    // ctx.cookies.set('koa:sess')
    // ctx.cookies.set('token')
    ctx.session = null
    ctx.response.redirect("/")
  }
})

app.listen(3001)
console.log("listening on port 3001")
