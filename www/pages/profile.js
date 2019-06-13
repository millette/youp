// npm
import nextCookie from "next-cookies"
import fetch from "isomorphic-unfetch"

// self
import Layout from "../components/layout"

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
  if (!hello) return {}
  try {
    const oy = JSON.parse(hello)
    const headers = { cookie: ctx.req && ctx.req.headers.cookie }
    const fetcher = ctx.req
      ? fetch("http://localhost:3000/api/me", { headers })
      : fetch("/api/me")

    return fetcher
      .then((res) => res.json())
      .then((json) => {
        console.log("EL-JSON", json)
        return {
          ...oy,
          json,
        }
      })
  } catch (e) {
    console.log("Cookie oups", hello, e)
    return {}
  }
}

export default Profile
