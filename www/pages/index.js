// npm
import React from "react"
import nextCookie from "next-cookies"

// self
import Layout from "../components/layout"

const atob =
  (typeof window !== "undefined" && window.atob) ||
  ((a) => Buffer.from(a, "base64").toString())

const Home = ({ provider, token, profile }) => (
  <Layout profile={profile}>
    <h1>Cookie-based authentication example</h1>

    <pre>{JSON.stringify(provider, null, "  ")}</pre>
    <pre>{JSON.stringify(token, null, "  ")}</pre>
    <pre>{JSON.stringify(profile, null, "  ")}</pre>
    <style jsx>{`
      li {
        margin-bottom: 0.5rem;
      }
    `}</style>
  </Layout>
)

Home.getInitialProps = (ctx) => {
  const sesh = nextCookie(ctx)["koa:sess"]
  if (!sesh) return {}
  const {
    grant: {
      provider,
      profile,
      response: { access_token: token },
    },
  } = JSON.parse(atob(sesh))
  return {
    provider,
    token,
    profile,
  }
}

export default Home
