import "./Header.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";


  type Props = {
    onMenuOpen: () => void;
    isMobileMenuOpen: boolean;
  };

export default function Header({ onMenuOpen, isMobileMenuOpen }: Props) {

  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    // 1. return class depending on isActive
    return isActive ? "header__nav-link header__nav-link--active" : "header__nav-link";  
  }

  return (
    <header className={isMobileMenuOpen ? 'header header_mobile' : 'header'}>
      <button
        type="button"
        className="header__menu-btn"
        aria-label="Open menu"
        onClick={onMenuOpen}
      />
      <div className="header__brand">
        <img src={logo} alt="Mesh AI" className="header__logo" />
      </div>

      <nav className={isMobileMenuOpen ? 'header__nav header__nav_mobile' : 'header__nav'}>
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