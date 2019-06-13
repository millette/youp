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
const levelErrors = require("level-errors")
const profile = require("grant-profile").koa()

const callback = "/api/welcome"

const elDb = level("my-db", { valueEncoding: "json" })

const prefixed = (key) => {
  console.log("PREFIXED", new Date(), `session:${key}`)
  return `session:${key}`
}

const store = {
  get: (key) => {
    return (
      elDb
        .get(prefixed(key))
        /*
      .then((x) => {
        console.log('GET-STORE', new Date(), key, x)
        return x
      })
      */
        .catch((e) => {
          console.log("GET-STORE ERR", new Date(), key, e)
          if (!(e instanceof levelErrors.NotFoundError)) throw e
        })
    )
  },
  set: (key, sess) => elDb.put(prefixed(key), sess),
  destroy: (key) => elDb.del(prefixed(key)),
  /*
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
  */
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
// app.use(session({ store, prefix: "session:" }, app))

app.use(async (ctx, next) => {
  console.log("LOGGGGING:", new Date(), ctx.request.url)
  await next()
  console.log("After next...")
})

app.use(session({ store }, app))
app.use(bodyParser())
app.use(mount(grant))

const areEnabled = () => {
  const enabled = []
  for (let r in grant.config)
    if (grant.config[r].key && grant.config[r].secret) enabled.push(r)

  console.log("ENABLED", new Date(), enabled)
  return { enabled }
}

app.use(profile(grantConfig))

app.use(async (ctx) => {
  switch (ctx.request.path) {
    case "/api/enabled":
      ctx.body = areEnabled()
      break

    case "/api/me":
      const who = ctx.session.grant && ctx.session.grant.profile
      // console.log('WHO', who, typeof who)

      if (typeof who === "string") {
        // console.log('STRING')
        // const x = await elDb.get(who)
        // await next()
        // console.log('After NEXT')
        // ctx.body = JSON.stringify(x)
        // console.log('GOT WHO', ctx.response.body)
        // return
        return elDb.get(who).then((x) => {
          ctx.body = x
        })
      }
      if (typeof who === "object") {
        console.log("OBJECT")
        ctx.body = who
        break
      }
      console.log("OTHER", who, typeof who)
      ctx.body = {}
      break

    case "/api/fixer":
      grant.config.github.key = process.env.GITHUB_KEY
      grant.config.github.secret = process.env.GITHUB_SECRET
      ctx.body = areEnabled()
      break

    case callback:
      if (!ctx.session || !ctx.session.grant) {
        ctx.body = { err: "no-session", session: ctx.session }
        break
      }
      const {
        provider,
        profile,
        response: { access_token: token },
      } = ctx.session.grant
      const userId = profile && (profile.id || profile.login || profile.url)
      ctx.assert(userId, 501, "Could not determine user id from profile.", {
        provider,
        profile,
      })
      const profileId = ["user", provider, userId].join(":")
      profile._sessionKey = prefixed(ctx.cookies.get("koa:sess"))
      ctx.session.grant.profile = profileId
      try {
        await elDb.put(profileId, profile)
        ctx.cookies.set(
          "hello",
          JSON.stringify({
            profileId,
            provider,
            token,
          }),
          { httpOnly: false, sign: true }
        )
      } catch (e) {
        console.log("WELCOME PUT ERR", e, profileId, profile)
      }
      ctx.response.redirect("/")
      break

    case "/api/logout":
      if (ctx.request.method !== "POST") break
      ctx.session = null
      ctx.cookies.set("hello", null, { httpOnly: false, sign: true })
      ctx.response.redirect("/")
      break
  }
})

app.listen(3001)
console.log("listening on port 3001")
