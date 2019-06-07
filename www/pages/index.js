import React from "react"
import Layout from "../components/layout"
import nextCookie from "next-cookies"
import cookie from "js-cookie"

const atob =
  (typeof window !== "undefined" && window.atob) ||
  ((a) => Buffer.from(a, "base64").toString())

const Home = ({ provider, token, profile }) => (
  <Layout>
    <h1>Cookie-based authentication example</h1>

    <p>Steps to test the functionality:</p>

    <ol>
      <li>Click login and enter your GitHub username.</li>
      <li>
        Click home and click profile again, notice how your session is being
        used through a token stored in a cookie.
      </li>
      <li>
        Click logout and try to go to profile again. You'll get redirected to
        the `/login` route.
      </li>
    </ol>
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
  // const cookies = nextCookie(ctx)
  // const sesh = cookies && cookies["koa:sess"]
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
