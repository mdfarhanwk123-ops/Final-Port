import { useState } from "react";
import SectionTitle from "./SectionTitle";
import { sendContactEmail } from "../services/emailService";
import { portfolioData } from "../data/portfolioData";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      await sendContactEmail(form);
      setStatus({ type: "success", message: "Message sent. I'll reply soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to send. Try again later." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionTitle
          number="07"
          title="Contact"
          subtitle="Let's talk design"
        />

        <div className="contact-grid">
          <div className="contact-info">
            <div className="code-comment">// Get in touch</div>

            <h3>
              Have a project or
              <span> opportunity?</span>
            </h3>

            <p>
              Open to design engineer roles, CAD collaborations, and automotive
              projects. Reach out on any channel below.
            </p>

            <div className="contact-method">
              <span className="contact-symbol">@</span>
              <div>
                <small>EMAIL</small>
                <a href={`mailto:${portfolioData.email}`}>
                  {portfolioData.email}
                </a>
              </div>
            </div>

            <div className="contact-method">
              <span className="contact-symbol">☎</span>
              <div>
                <small>PHONE / WHATSAPP</small>
                <a href={`tel:${portfolioData.phone}`}>{portfolioData.phone}</a>
              </div>
            </div>

            <div className="contact-method">
              <span className="contact-symbol">in</span>
              <div>
                <small>LINKEDIN</small>
                <a href={portfolioData.linkedin} target="_blank" rel="noreferrer">
                  linkedin.com/in/mohamedfarhan87
                </a>
              </div>
            </div>

            <div className="contact-method">
              <span className="contact-symbol">◈</span>
              <div>
                <small>PORTFOLIO</small>
                <a href={portfolioData.portfolio} target="_blank" rel="noreferrer">
                  Design Portfolio ↗
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">NAME</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">SUBJECT</label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Project / Job opportunity"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">MESSAGE</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message..."
                required
              />
            </div>

            {status.message && (
              <div className={`form-status ${status.type}`}>{status.message}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary form-submit"
              disabled={sending}
            >
              {sending ? "SENDING..." : "SEND MESSAGE →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;