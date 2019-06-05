// core
const { createServer } = require("http")

// npm
const httpProxy = require("http-proxy")
const next = require("next")

const app = next({ dev: true })
const handle = app.getRequestHandler()

const proxy = httpProxy.createProxyServer()
const target = "http://localhost:3001"

app.prepare().then(() => {
  createServer((req, res) => {
    if (req.url === "/api/profile" || req.url === "/api/login")
      return proxy.web(req, res, { target }, (e) => {
        console.log("e-errno", e.errno)
        console.log("e.code", e.code)
        console.log("e.address", e.address)
        console.log("e.port", e.port)
      })
    handle(req, res)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log("> Ready on http://localhost:3000")
  })
})
