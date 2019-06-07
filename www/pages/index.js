import React from "react"
import Layout from "../components/layout"
import nextCookie from "next-cookies"
import cookie from "js-cookie"

const atob =
  (typeof window !== "undefined" && window.atob) ||
  ((a) => Buffer.from(a, "base64").toString())

const Home = (props) => (
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
    <pre>{JSON.stringify(props, null, "  ")}</pre>
    <style jsx>{`
      li {
        margin-bottom: 0.5rem;
      }
    `}</style>
  </Layout>
)

Home.getInitialProps = (ctx) => {
  const { req } = ctx
  const oy = nextCookie(ctx)
  if (oy["koa:sess"]) {
    console.log("SESION-COOKIE!", !!req)
    const a = atob(oy["koa:sess"])
    const b = JSON.parse(a)
    console.log("A", a)
    console.log("B", b)
    const ret = {
      provider: b.grant.provider,
      token: b.grant.response.access_token,
    }
    // cookie.set('resp', ret)
    return ret
  }
  return {}
  /*
  console.log('oy', oy)
  console.log('req.url', req && req.url)
  console.log('req.headers', req && req.headers)
  */

  /*
  if (req) return {}

  const ga = cookie.get('resp')
  console.log('GA', ga)
  return {}
  */

  /*
  const a2 = atob(ga)
  const b2 = JSON.parse(a2)
  console.log('A2', a2)
  console.log('B2', b2)
  return {
    provider: b2.grant.provider,
    token: b2.grant.response.access_token
  }
  */
}

export default Home
