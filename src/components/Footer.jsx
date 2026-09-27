import { portfolioData } from "../data/portfolioData";
import DevCredit from "./DevCredit";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <a href="#home" className="logo">
            <span className="logo-mark">MF</span>
            <span className="logo-divider">/</span>
            <span className="logo-label">DESIGN</span>
          </a>
          <p>
            {portfolioData.role} · {portfolioData.location}
          </p>
        </div>

        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#certificates">Certificates</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-social">
          <a href={portfolioData.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={portfolioData.portfolio} target="_blank" rel="noreferrer">
            Portfolio
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Mohamed Farhan M. All rights reserved.
        </p>

        <DevCredit size={35} />
      </div>
    </footer>
  );
}

export default Footer;