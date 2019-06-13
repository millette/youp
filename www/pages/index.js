// npm
import Link from "next/link"
import nextCookie from "next-cookies"

// self
import Layout from "../components/layout"

const Home = ({ profileId, provider, token }) => (
  <Layout token={token}>
    <h1>Cookie-based authentication example</h1>
    {token ? (
      <p>
        Hello {profileId} from {provider}.
      </p>
    ) : (
      <p>
        Not logged in.{" "}
        <Link href="/login">
          <a>Login?</a>
        </Link>
      </p>
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
}

export default Home
