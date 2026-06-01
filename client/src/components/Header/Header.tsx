import "./Header.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";


export default function Header() {
  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    // 1. return class depending on isActive
    return isActive ? "header__nav-link header__nav-link--active" : "header__nav-link";  
  }

  return (
    <header className="header">
      <div className="header__brand">
        <img src={logo} alt="Mesh AI" className="header__logo" />
      </div>

      <nav className="header__nav">
        <NavLink to="/knowledge" className={getNavLinkClass}>
          Knowledge Base
        </NavLink>
        <NavLink to="/chat" className={getNavLinkClass}>
          Chat
        </NavLink>
      </nav>
    </header>
  );
}