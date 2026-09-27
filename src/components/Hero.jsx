import { useEffect, useState } from "react";
import { portfolioData } from "../data/portfolioData";
import { getPortfolioMeta } from "../services/portfolioService";

function Hero() {
  const roles = portfolioData.roles;
  const [roleIndex, setRoleIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [zoom, setZoom] = useState(100);

  /* Typewriter */
  useEffect(() => {
    const current = roles[roleIndex];
    const speed = deleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.substring(0, display.length + 1));
        if (display === current) setTimeout(() => setDeleting(true), 1400);
      } else {
        setDisplay(current.substring(0, display.length - 1));
        if (display === "") {
          setDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [display, deleting, roleIndex, roles]);

  /* Resume meta */
  useEffect(() => {
    getPortfolioMeta()
      .then((meta) => {
        if (meta?.resumeUrl) {
          setResumeUrl(meta.resumeUrl);
          setResumeName(meta.resumeName || "Mohamed_Farhan_CV.pdf");
        }
      })
      .catch(() => {});
  }, []);

  /* Zoom counter ticks */
  useEffect(() => {
    const t = setInterval(() => {
      setZoom((z) => {
        const delta = Math.round((Math.random() - 0.5) * 4);
        return Math.max(96, Math.min(104, z + delta));
      });
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const nameParts = portfolioData.name.split(" ");

  return (
    <section id="home" className="hero-section">
      <div className="hero-grid"></div>
      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>

      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="tag-dot"></span>
            Available for work
          </div>

          <h1 className="hero-name">
            {nameParts.map((part, i) => (
              <span key={i} className="hero-name-line">
                {part}
              </span>
            ))}
            <span className="hero-dot">.</span>
          </h1>

          <div className="hero-role">
            <span className="role-arrow">→</span>
            <span className="role-text">{display}</span>
            <span className="role-cursor">|</span>
          </div>

          <p className="hero-description">{portfolioData.description}</p>

          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              View Projects <span>→</span>
            </a>
            <a href="#contact" className="btn btn-gold">
              Contact Me
            </a>
            {resumeUrl && (
              <a href={resumeUrl} download={resumeName} className="btn btn-ghost">
                Resume ↓
              </a>
            )}
          </div>

          <div className="hero-stats">
            <div className="stat">
              <strong>10<em>+</em></strong>
              <span>CAD Models</span>
            </div>
            <div className="stat-line"></div>
            <div className="stat">
              <strong>02</strong>
              <span>Companies</span>
            </div>
            <div className="stat-line"></div>
            <div className="stat">
              <strong>04</strong>
              <span>Languages</span>
            </div>
          </div>
        </div>

        {/* ─── CAD BLUEPRINT WORKSTATION ─── */}
        <div className="hero-visual">
          <div className="cad-viewport">
            {/* Screen chrome */}
            <div className="cad-topbar">
              <div className="cad-topbar-left">
                <span className="cad-dot cad-dot-red" />
                <span className="cad-dot cad-dot-yellow" />
                <span className="cad-dot cad-dot-green" />
              </div>
              <div className="cad-topbar-title">
                sedan_side_profile.dwg
              </div>
              <div className="cad-topbar-right">
                <span>{zoom}%</span>
              </div>
            </div>

            {/* Tool rail */}
            <div className="cad-toolrail">
              {["⌖", "▢", "◯", "✎", "⌇", "△", "⊞"].map((t, i) => (
                <div
                  key={i}
                  className="cad-tool"
                  style={{ animationDelay: `${2 + i * 0.08}s` }}
                >
                  {t}
                </div>
              ))}
            </div>

            {/* Layer tree */}
            <div className="cad-layers">
              <div className="cad-layer cad-layer-active">
                <span className="cad-layer-dot" />BODY
              </div>
              <div className="cad-layer">
                <span className="cad-layer-dot" />WHEELS
              </div>
              <div className="cad-layer">
                <span className="cad-layer-dot" />DIMS
              </div>
              <div className="cad-layer">
                <span className="cad-layer-dot" />NOTES
              </div>
            </div>

            {/* Main viewport with drawing */}
            <div className="cad-canvas">
              <svg viewBox="0 0 800 500" className="cad-drawing" aria-hidden="true">
                <defs>
                  <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none"
                          stroke="rgba(243, 236, 225, 0.05)" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="cadFineGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none"
                          stroke="rgba(243, 236, 225, 0.02)" strokeWidth="0.4" />
                  </pattern>
                </defs>

                <rect width="800" height="500" fill="url(#cadFineGrid)" />
                <rect width="800" height="500" fill="url(#cadGrid)" />

                {/* ── CAR PROFILE — draws itself ── */}
                <g className="cad-car">
                  <path
                    d="M 90 340
                       L 90 290
                       Q 100 265 130 260
                       L 240 258
                       Q 265 258 285 235
                       L 340 200
                       Q 360 185 395 182
                       L 470 180
                       Q 505 180 525 205
                       L 570 258
                       L 680 258
                       Q 720 260 725 290
                       L 725 340"
                    fill="none"
                    stroke="rgba(243, 236, 225, 0.9)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="1400"
                    strokeDashoffset="1400"
                    className="cad-path-body"
                  />

                  {/* Windshield / window lines */}
                  <path
                    d="M 290 255
                       L 350 215
                       L 425 212
                       L 460 255"
                    fill="none"
                    stroke="rgba(207, 174, 111, 0.7)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    className="cad-path-window"
                  />

                  {/* Door line */}
                  <line
                    x1="470" y1="258" x2="470" y2="340"
                    stroke="rgba(243, 236, 225, 0.5)"
                    strokeWidth="1.2"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    className="cad-path-door"
                  />

                  {/* Front wheel */}
                  <circle
                    cx="215" cy="340" r="52"
                    fill="none"
                    stroke="rgba(243, 236, 225, 0.9)"
                    strokeWidth="2"
                    strokeDasharray="330"
                    strokeDashoffset="330"
                    className="cad-path-wheel-1"
                  />
                  <circle
                    cx="215" cy="340" r="30"
                    fill="none"
                    stroke="rgba(207, 174, 111, 0.75)"
                    strokeWidth="1.2"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    className="cad-path-wheel-1-inner"
                  />
                  {/* Wheel spokes */}
                  <g className="cad-spokes-1">
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <line
                          key={i}
                          x1="215" y1="340"
                          x2={215 + 30 * Math.cos(rad)}
                          y2={340 + 30 * Math.sin(rad)}
                          stroke="rgba(207, 174, 111, 0.5)"
                          strokeWidth="0.8"
                        />
                      );
                    })}
                  </g>

                  {/* Rear wheel */}
                  <circle
                    cx="600" cy="340" r="52"
                    fill="none"
                    stroke="rgba(243, 236, 225, 0.9)"
                    strokeWidth="2"
                    strokeDasharray="330"
                    strokeDashoffset="330"
                    className="cad-path-wheel-2"
                  />
                  <circle
                    cx="600" cy="340" r="30"
                    fill="none"
                    stroke="rgba(207, 174, 111, 0.75)"
                    strokeWidth="1.2"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    className="cad-path-wheel-2-inner"
                  />
                  <g className="cad-spokes-2">
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <line
                          key={i}
                          x1="600" y1="340"
                          x2={600 + 30 * Math.cos(rad)}
                          y2={340 + 30 * Math.sin(rad)}
                          stroke="rgba(207, 174, 111, 0.5)"
                          strokeWidth="0.8"
                        />
                      );
                    })}
                  </g>

                  {/* Ground line */}
                  <line
                    x1="60" y1="395" x2="750" y2="395"
                    stroke="rgba(243, 236, 225, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="690"
                    strokeDashoffset="690"
                    className="cad-path-ground"
                  />
                </g>

                {/* ── DIMENSION LINES ── */}
                <g className="cad-dims">
                  {/* Wheelbase dim */}
                  <line x1="215" y1="430" x2="600" y2="430"
                        stroke="rgba(207, 174, 111, 0.7)" strokeWidth="0.9"
                        strokeDasharray="385" strokeDashoffset="385"
                        className="cad-dim-line-1" />
                  <line x1="215" y1="422" x2="215" y2="438"
                        stroke="rgba(207, 174, 111, 0.7)" strokeWidth="0.9"
                        className="cad-fade cad-fade-1" />
                  <line x1="600" y1="422" x2="600" y2="438"
                        stroke="rgba(207, 174, 111, 0.7)" strokeWidth="0.9"
                        className="cad-fade cad-fade-1" />
                  <polygon points="215,430 227,425 227,435"
                           fill="rgba(207, 174, 111, 0.9)"
                           className="cad-fade cad-fade-1" />
                  <polygon points="600,430 588,425 588,435"
                           fill="rgba(207, 174, 111, 0.9)"
                           className="cad-fade cad-fade-1" />

                  {/* Overall width dim */}
                  <line x1="40" y1="180" x2="40" y2="395"
                        stroke="rgba(207, 174, 111, 0.7)" strokeWidth="0.9"
                        strokeDasharray="215" strokeDashoffset="215"
                        className="cad-dim-line-2" />
                  <line x1="32" y1="180" x2="48" y2="180"
                        stroke="rgba(207, 174, 111, 0.7)" strokeWidth="0.9"
                        className="cad-fade cad-fade-2" />
                  <line x1="32" y1="395" x2="48" y2="395"
                        stroke="rgba(207, 174, 111, 0.7)" strokeWidth="0.9"
                        className="cad-fade cad-fade-2" />

                  {/* Roof height callout */}
                  <line x1="395" y1="182" x2="395" y2="130"
                        stroke="rgba(207, 174, 111, 0.6)" strokeWidth="0.8"
                        strokeDasharray="52" strokeDashoffset="52"
                        className="cad-callout-line-1" />
                </g>

                {/* Scan beam across drawing */}
                <rect className="cad-scan" x="0" y="0" width="800" height="2"
                      fill="rgba(207, 174, 111, 0.5)"
                      filter="blur(1px)" />
              </svg>

              {/* Floating labels over drawing */}
              <div className="cad-callout cad-callout-1">
                <span className="cad-callout-key">WB</span>
                <span className="cad-callout-val">2860 mm</span>
              </div>
              <div className="cad-callout cad-callout-2">
                <span className="cad-callout-key">H</span>
                <span className="cad-callout-val">1520 mm</span>
              </div>
              <div className="cad-callout cad-callout-3">
                <span className="cad-callout-key">R</span>
                <span className="cad-callout-val">45 · 4×</span>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="cad-statusbar">
              <span className="cad-status-dot" />
              <span className="cad-status-text">SNAP: ON</span>
              <span className="cad-status-text">ORTHO: ON</span>
              <span className="cad-status-coords">X: 215.40 · Y: 340.00 · Z: 0.00</span>
              <span className="cad-status-right">LAYER: BODY</span>
            </div>

            {/* Title block overlay */}
            <div className="cad-titleblock">
              <div className="tb-row">
                <span className="tb-key">DWG NO</span>
                <span className="tb-val">MF-2025-0142</span>
              </div>
              <div className="tb-row">
                <span className="tb-key">PART</span>
                <span className="tb-val">SEDAN · SIDE</span>
              </div>
              <div className="tb-row">
                <span className="tb-key">SCALE</span>
                <span className="tb-val">1:20 · ISO-A3</span>
              </div>
              <div className="tb-row">
                <span className="tb-key">STATUS</span>
                <span className="tb-val tb-val-active">● APPROVED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className="scroll-indicator">
        <span>Scroll</span>
        <div></div>
      </a>
    </section>
  );
}

export default Hero;