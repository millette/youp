// self
import Layout from "../components/layout"

const Login = (props) => (
  <Layout>
    <div className="login">
      <form method="post" action="/connect/github">
        {/*
        <label>GitHub key
          <input
            type="text"
            name="key"
          />
        </label>
        <label>GitHub secret
          <input
            type="text"
            name="secret"
          />
        </label>
        <input
          type="hidden"
          name="callback"
          value="/login"
        />
        */}
        <button type="submit">Login</button>
      </form>
    </div>
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
  console.log("req.url", req && req.url)
  console.log("req.headers", req && req.headers)
  return {}
  /*
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"

  const apiUrl = process.browser
    ? `${protocol}://${window.location.host}/api/login`
    : `${protocol}://${req.headers.host}/api/login`

  return { apiUrl }
  */
}

export default Login
