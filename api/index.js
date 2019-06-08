"use strict"

// npm
require("dotenv-safe").config()
const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const session = require("koa-session") // see https://nodejs.org/api/deprecations.html#deprecations_dep0079_custom_inspection_function_on_objects_via_inspect
const mount = require("koa-mount")
const Grant = require("grant-koa")
const profile = require("grant-profile").koa()

const callback = "/api/welcome"

const grantConfig = {
  defaults: {
    protocol: "http",
    host: "localhost:3000",
    transport: "session",
    callback,
  },
  github: {
    key: process.env.GITHUB_KEY,
    secret: process.env.GITHUB_SECRET + "!",
  },
  twitter: {
    key: process.env.TWITTER_KEY,
    secret: process.env.TWITTER_SECRET,
  },
}

const grant = new Grant(grantConfig)
const app = new Koa()
app.keys = ["grant"]
app.use(session({ httpOnly: false }, app))
app.use(bodyParser())
app.use(mount(grant))
app.use(profile(grantConfig))

app.use((ctx) => {
  if (ctx.request.path === "/api/fixer") {
    // console.log("grant.config", grant.config)
    grant.config.github.secret = process.env.GITHUB_SECRET
    ctx.body = grant.config
  }

  if (ctx.request.path === callback) {
    // console.log("ctx.session.grant", ctx.session && ctx.session.grant)
    if (ctx.session) {
      if (ctx.session.grant.response.raw.error) {
        ctx.body = ctx.session.grant.response.raw
        ctx.session = null
        return
      }
      ctx.session.grant.profile = ctx.session.grant.profile
      return ctx.response.redirect("/")
    }
    ctx.body = { err: "no-session" }
  }

  if (ctx.request.path === "/api/logout" && ctx.request.method === "POST") {
    ctx.session = null
    ctx.response.redirect("/")
  }
})

app.listen(3001)
console.log("listening on port 3001")
