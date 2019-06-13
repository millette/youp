// npm
import Link from "next/link"

const Header = ({ token }) => (
  <header>
    <nav>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        {token ? (
          <>
            <li>
              <Link href="/profile">
                <a>Profile</a>
              </Link>
            </li>
            <li>
              <form method="post" action="/api/logout">
                <button type="submit">Logout {token}</button>
              </form>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </li>
        )}
      </ul>
    </nav>
    <style jsx>{`
      ul {
        display: flex;
        list-style: none;
        margin-left: 0;
        padding-left: 0;
      }

      li {
        margin-right: 1rem;
      }

      li:first-child {
        margin-left: auto;
      }

      a {
        color: #fff;
        text-decoration: none;
      }

      header {
        padding: 0.2rem;
        color: #fff;
        background-color: #333;
      }
    `}</style>
  </header>
)

export default Header
