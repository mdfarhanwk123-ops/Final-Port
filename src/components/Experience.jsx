import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { getExperience } from "../services/portfolioService";

function Experience() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getExperience()
      .then((data) => setItems(data))
      .catch(() => {});
  }, []);

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <SectionTitle
          number="04"
          title="Experience"
          subtitle="Where I've worked"
        />

        <div className="timeline">
          {items.map((item, i) => (
            <div className="timeline-item" key={item.id || i}>
              <div className="timeline-marker">
                <span></span>
              </div>

              <div className="timeline-content">
                <div className="timeline-head">
                  <div>
                    <h3>{item.role}</h3>
                    <p className="timeline-company">{item.company}</p>
                  </div>
                  <div className="timeline-meta">
                    <span>{item.period}</span>
                    <span>{item.location}</span>
                  </div>
                </div>

                {item.points && (
                  <ul className="timeline-points">
                    {item.points.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p style={{ color: "var(--text-muted)" }}>No experience added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Experience;