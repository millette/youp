// npm
import Link from "next/link"

// self
// import { logout } from "../utils/auth"

const Header = () => (
  <header>
    <nav>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </li>
        <li>
          <Link href="/profile">
            <a>Profile</a>
          </Link>
        </li>
        <li>
          {/*
          <button onClick={logout}>Logout</button>
          <a href="/api/logout">Logout</a>
          */}
          <form method="post" action="/api/logout">
            <button type="submit">Logout</button>
          </form>
        </li>
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
