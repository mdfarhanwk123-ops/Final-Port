import { useState } from "react";
import Logo from "./Logo";

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Logo />

        <button
          className={`mobile-menu-button ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-menu ${open ? "open" : ""}`}>
          <a href="#home" onClick={close}>Home</a>
          <a href="#about" onClick={close}>About</a>
          <a href="#skills" onClick={close}>Skills</a>
          <a href="#experience" onClick={close}>Experience</a>
          <a href="#projects" onClick={close}>Projects</a>
          <a href="#certificates" onClick={close}>Certificates</a>
          <a href="#contact" onClick={close}>Contact</a>
          <a href="/admin/login" className="nav-admin" onClick={close}>Admin</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;