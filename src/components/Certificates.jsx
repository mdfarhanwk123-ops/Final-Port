import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { getCertificates } from "../services/portfolioService";

function Certificates() {
  const [items, setItems] = useState([]);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    getCertificates()
      .then((data) => setItems(data))
      .catch(() => {});
  }, []);

  return (
    <section id="certificates" className="section certificates-section">
      <div className="container">
        <SectionTitle
          number="06"
          title="Certificates"
          subtitle="Verified credentials"
        />

        <div className="certificates-grid">
          {items.map((c, i) => (
            <div className="certificate-card" key={c.id || i}>
              <div className="certificate-icon">◆</div>
              <h3>{c.title}</h3>
              <p className="certificate-issuer">{c.issuer}</p>
              {c.year && <p className="certificate-year">{c.year}</p>}

              {c.imageUrl && (
                <button
                  className="certificate-view-btn"
                  onClick={() => setViewing(c)}
                >
                  VIEW CERTIFICATE →
                </button>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <p style={{ color: "var(--text-muted)" }}>No certificates added yet.</p>
          )}
        </div>
      </div>

      {viewing && (
        <div className="modal-backdrop" onClick={() => setViewing(null)}>
          <div className="modal certificate-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewing(null)}>×</button>
            <h3>{viewing.title}</h3>
            <p className="certificate-issuer">{viewing.issuer} · {viewing.year}</p>
            <img src={viewing.imageUrl} alt={viewing.title} className="certificate-full" />
          </div>
        </div>
      )}
    </section>
  );
}

export default Certificates;