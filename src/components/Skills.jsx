import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { getSkills } from "../services/portfolioService";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then((data) => setSkills(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <SectionTitle
          number="02"
          title="Skills"
          subtitle="What I bring to the design floor"
        />

        <div className="skills-grid">
          {skills.map((skill, i) => (
            <div className="skill-card" key={skill.id || i}>
              <div className="skill-card-header">
                <div className="skill-icon">{String(i + 1).padStart(2, "0")}</div>
                <div className="skill-info">
                  <h3>{skill.name}</h3>
                  <span>{skill.category}</span>
                </div>
                <strong>{skill.level}%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
          {!loading && skills.length === 0 && (
            <p style={{ color: "var(--text-muted)" }}>No skills added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Skills;