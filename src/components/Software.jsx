import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { getSoftware } from "../services/portfolioService";

function Software() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getSoftware()
      .then((data) => setItems(data))
      .catch(() => {});
  }, []);

  return (
    <section id="software" className="section software-section">
      <div className="container">
        <SectionTitle
          number="03"
          title="Software Proficiency"
          subtitle="Tools I work with daily"
        />

        <div className="software-grid">
          {items.map((item, i) => (
            <div className="software-card" key={item.id || i}>
              <div className="software-name">{item.name}</div>
              <div className="software-level">
                <div className="software-dots">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={n <= (item.rating || 4) ? "filled" : ""}
                    />
                  ))}
                </div>
              </div>
              {item.note && <p className="software-note">{item.note}</p>}
            </div>
          ))}
          {items.length === 0 && (
            <p style={{ color: "var(--text-muted)" }}>No software added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Software;