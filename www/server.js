// core
const { createServer } = require("http")
const { parse } = require("url")

// npm
const httpProxy = require("http-proxy")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

const proxy = httpProxy.createProxyServer()
const target = "http://localhost:3001"

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    switch (pathname) {
      case "/api/login.js":
        proxy.web(req, res, { target }, (error) => {
          console.log("Error!", error)
        })
        break

      case "/api/profile.js":
        proxy.web(req, res, { target }, (error) => console.log("Error!", error))
        break

      default:
        handle(req, res, parsedUrl)
        break
    }
  }).listen(3000, (err) => {
    if (err) throw err
    console.log("> Ready on http://localhost:3000")
  })
})
