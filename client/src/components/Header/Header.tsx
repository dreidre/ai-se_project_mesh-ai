import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";


export default function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive
      ? "header__nav-link header__nav-link--active"
      : "header__nav-link";
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="header__brand">
        <img src={logo} alt="Mesh AI" className="header__logo" />
      </div>

      <nav className="header__nav">
        {isAuthenticated ? (
          <>
            <NavLink to="/knowledge" className={getNavLinkClass}>
              Knowledge Base
            </NavLink>
            <NavLink to="/chat" className={getNavLinkClass}>
              Chat
            </NavLink>
            <div className="header__user-menu">
              <button
                aria-label="Logout"
                className="header__logout-button"
                type="button"
                onClick={handleLogout}
              >
                <svg
                  aria-hidden="true"
                  className="header__logout-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 6H6.75A1.75 1.75 0 0 0 5 7.75v8.5C5 17.22 5.78 18 6.75 18H10M14 8l4 4m0 0-4 4m4-4H9"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                  />
                </svg>
              </button>
              {currentUser && (
                <span className="header__user">{currentUser.name}</span>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" className={getNavLinkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={getNavLinkClass}>
              Register
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
