// npm
import fetch from "isomorphic-unfetch"
import Router from "next/router"

// self
import Layout from "../components/layout"

const fixit = (ev) => {
  console.log("fixit...")
  fetch("/api/fixer")
    .then((res) => res.json())
    .then((json) => {
      console.log("fixit-json", json)
      Router.replace(document.location.pathname)
    })
    .catch((e) => {
      console.error("fixit-OUPSY", e)
    })
}

const Login = (props) => (
  <Layout>
    <h1>Login</h1>
    {props.enabled && props.enabled.length ? (
      <div className="login">
        {props.enabled.map((en) => (
          <form key={en} method="post" action={`/connect/${en}`}>
            <button type="submit">{en}</button>
          </form>
        ))}
      </div>
    ) : (
      <div>
        No providers configured to login,{" "}
        <button onClick={fixit}>Fix it</button>.
      </div>
    )}
    <style jsx>{`
      .login {
        max-width: 340px;
        margin: 0 auto;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      form {
        display: flex;
        flex-flow: column;
      }

      label {
        font-weight: 600;
      }

      input {
        padding: 8px;
        margin: 0.3rem 0 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    `}</style>
  </Layout>
)

Login.getInitialProps = ({ req }) => {
  return fetch(req ? "http://localhost:3000/api/enabled" : "/api/enabled")
    .then((res) => res.json())
    .then((json) => {
      console.log("json", json)
      return json
    })
    .catch((e) => {
      console.error("OUPSY", e)
      return {}
    })
  /*
  console.log("req.url", req && req.url)
  console.log("req.headers", req && req.headers)
  return {}
  */

  /*
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"

  const apiUrl = process.browser
    ? `${protocol}://${window.location.host}/api/login`
    : `${protocol}://${req.headers.host}/api/login`

  return { apiUrl }
  */
}

export default Login
