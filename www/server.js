// core
const { createServer } = require("http")

// npm
const httpProxy = require("http-proxy")
const next = require("next")

const app = next({ dev: true })
const handle = app.getRequestHandler()
const proxy = httpProxy.createProxyServer()
const target = "http://localhost:3001"
const isErr = (e) => e && handle(req, res, e)

app.prepare().then(() => {
  createServer((req, res) => {
    if (req.url.indexOf("/connect/") && req.url.indexOf("/api/"))
      return handle(req, res)
    console.log("proxying...", new Date(), req.url)
    proxy.web(req, res, { target }, isErr)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log("> Ready on http://localhost:3000")
  })
})
