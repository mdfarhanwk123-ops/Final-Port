import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { portfolioData } from "../data/portfolioData";
import { getPortfolioMeta } from "../services/portfolioService";

function About() {
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    getPortfolioMeta()
      .then((meta) => {
        if (meta?.photoUrl) setPhoto(meta.photoUrl);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <SectionTitle
          number="01"
          title="About Me"
          subtitle="A little about my journey"
        />

        <div className="about-grid">
          {/* ── PHOTO WITH SPEC ANNOTATIONS ── */}
          <div className="about-photo-wrapper">
            <div className="about-photo-frame">
              {photo ? (
                <img
                  src={photo}
                  alt={portfolioData.name}
                  className="about-photo"
                />
              ) : (
                <div className="about-photo-placeholder">
                  <span>MF</span>
                  <small>PHOTO</small>
                </div>
              )}

              {/* Corner brackets */}
              <div className="about-photo-tick tick-tl"></div>
              <div className="about-photo-tick tick-tr"></div>
              <div className="about-photo-tick tick-bl"></div>
              <div className="about-photo-tick tick-br"></div>
            </div>

            {/* Floating spec tags around the photo */}
            <div className="about-spec spec-1">
              <strong>PROFILE</strong>
              <span>FRONT · 1:1</span>
            </div>
            <div className="about-spec spec-2">
              <strong>STATUS</strong>
              <span>● ACTIVE</span>
            </div>

            <div className="about-spec spec-3">
              {/* <strong>LOCATION</strong>
              <span>Chennai, IN</span> */}
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="about-content">
            <div className="code-comment">
              // A design engineer with automotive roots
            </div>

            <h3>
              Designing precision,
              <span> engineering quality.</span>
            </h3>

            <p>
              I'm a <strong>Design Engineer</strong> with hands-on experience
              in 3D modelling, CAD design, and quality inspection across the
              automotive industry.
            </p>

            <p>
              My tools include <strong>PTC CREO Parametric</strong>,{" "}
              <strong>CATIA V5</strong>, <strong>SolidWorks</strong>, and{" "}
              <strong>AutoCAD</strong>. I'm proficient in <strong>GD&amp;T</strong>{" "}
              and tolerance stack-up analysis, with a strong focus on
              manufacturability and compliance.
            </p>

            <p>
              Having worked both on the design floor and the quality line, I
              bring a complete perspective — I don't just model parts, I
              understand how they're made, inspected, and used.
            </p>

            <div className="about-highlights">
              <div>
                <span className="highlight-icon">◈</span>
                <div>
                  <strong>CAD Expertise</strong>
                  <small>CREO · CATIA · SolidWorks · AutoCAD</small>
                </div>
              </div>
              <div>
                <span className="highlight-icon">◉</span>
                <div>
                  <strong>Quality Focus</strong>
                  <small>GD&amp;T, tolerance stack-up, inspection</small>
                </div>
              </div>
              <div>
                <span className="highlight-icon">◆</span>
                <div>
                  <strong>Team Player</strong>
                  <small>Cross-functional collaboration</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;