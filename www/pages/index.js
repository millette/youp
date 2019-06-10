// npm
import React from "react"
import nextCookie from "next-cookies"

// self
import Layout from "../components/layout"

const atob =
  (typeof window !== "undefined" && window.atob) ||
  ((a) => Buffer.from(a, "base64").toString())

const Home = ({ token }) => (
  <Layout token={token}>
    <h1>Cookie-based authentication example</h1>

    <pre>{JSON.stringify(token, null, "  ")}</pre>
    <style jsx>{`
      li {
        margin-bottom: 0.5rem;
      }
    `}</style>
  </Layout>
)

Home.getInitialProps = (ctx) => {
  const token = nextCookie(ctx)["token"]
  return { token }

  /*
  const sesh = nextCookie(ctx)["koa:sess"]
  if (!sesh) return {}
  const abc = atob(sesh)
  console.log("ABC", abc)
  const {
    grant: {
      provider,
      profile,
      response: { access_token: token },
    },
  } = JSON.parse(abc)
  return {
    provider,
    token,
    profile,
  }
  */
}

export default Home
