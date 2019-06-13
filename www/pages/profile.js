// npm
import nextCookie from "next-cookies"
import fetch from "isomorphic-unfetch"

// self
import Layout from "../components/layout"

/*
const atob =
  (typeof window !== "undefined" && window.atob) ||
  ((a) => Buffer.from(a, "base64").toString())
*/

const Profile = ({ profileId, provider, token, json }) => (
  <Layout token={token}>
    <h1>Profile</h1>

    {token && (
      <div>
        <p>Profile ID: {profileId}</p>
        <p>Provider: {provider}</p>
        <p>Token: {token}</p>
        <pre>{JSON.stringify(json, null, "  ")}</pre>
      </div>
    )}
    <style jsx>{`
      li {
        margin-bottom: 0.5rem;
      }
    `}</style>
  </Layout>
)

Profile.getInitialProps = (ctx) => {
  const hello = nextCookie(ctx)["hello"]
  console.log("HELLO", new Date(), !ctx.req, hello)
  if (!hello) return {}
  try {
    const oy = JSON.parse(hello)
    console.log("OY", oy)
    if (ctx.req) return oy
    const u = ctx.req ? "http://localhost:3000/api/me" : "/api/me"

    console.log("u", u)
    // return fetch(u, { credentials: 'same-origin' })
    return fetch(u)
      .then((res) => res.json())
      .then((json) => {
        console.log("EL-JSON", json)
        return {
          ...oy,
          json,
        }
      })
      .catch((e) => console.log("KARAMBA", e))
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

export default Profile
