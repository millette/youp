// npm
import React from "react"
import nextCookie from "next-cookies"

// self
import Layout from "../components/layout"

/*
const atob =
  (typeof window !== "undefined" && window.atob) ||
  ((a) => Buffer.from(a, "base64").toString())
*/

const Home = ({ profileId, provider, token }) => (
  <Layout token={token}>
    <h1>Cookie-based authentication example</h1>

    {token && (
      <div>
        <p>Profile ID: {profileId}</p>
        <p>Provider: {provider}</p>
        <p>Token: {token}</p>
      </div>
    )}
    <style jsx>{`
      li {
        margin-bottom: 0.5rem;
      }
    `}</style>
  </Layout>
)

Home.getInitialProps = (ctx) => {
  const hello = nextCookie(ctx)["hello"]
  console.log("HELLO", new Date(), !ctx.req, hello)
  if (!hello) return {}
  try {
    return JSON.parse(hello)
  } catch (e) {
    console.log("Cookie oups", hello, e)
    return {}
  }

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
