import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const footerColumns = {
  platform: [
    { icon: "bi-search",              label: "Find Doctors" },
    { icon: "bi-calendar-check",      label: "Book Appointment" },
    { icon: "bi-person-lines-fill",   label: "Patient Dashboard" },
    { icon: "bi-clipboard2-pulse",    label: "Doctor Workspace" },
  ],
  company: [
    { icon: "bi-info-circle",         label: "About Platform" },
    { icon: "bi-people",              label: "Care Coordination" },
    { icon: "bi-headset",             label: "Support Team" },
    { icon: "bi-gear",                label: "Admin Console" },
  ],
  contact: [
    { icon: "bi-telephone-fill",      label: "080-45309999" },
    { icon: "bi-envelope-fill",       label: "care@doctorbook.com" },
    { icon: "bi-geo-alt-fill",        label: "Bengaluru, India" },
    { icon: "bi-clock-fill",          label: "Mon – Sat / 8 AM – 8 PM" },
  ],
};

const AppFooter = () => (
  <footer className="footer-shell">
    <Container className="py-5 py-lg-6">
      {/* CTA strip */}
      <div className="footer-cta">
        <div>
          <span className="eyebrow">
            <i className="bi bi-chat-dots" />
            Need help booking?
          </span>
          <h3
            className="mt-3 mb-2"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "var(--teal-dark)",
            }}
          >
            Talk to our care coordination team
          </h3>
          <p className="mb-0" style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>
            Get support with specialist discovery, appointment scheduling, and follow-up planning.
          </p>
        </div>
        <Link to="/doctors" className="btn pill-button btn-teal flex-shrink-0">
          <i className="bi bi-arrow-right-circle me-2" />
          Find a Doctor
        </Link>
      </div>

      {/* Columns */}
      <div className="footer-grid mt-5">
        <div className="footer-brand-block">
          <div className="brand-mark footer-brand-mark">
            <span className="brand-badge">DB</span>
            <span>
              <strong>Doctor Book</strong>
              <small>Specialist Appointment Platform</small>
            </span>
          </div>
          <p
            className="mt-3 mb-0"
            style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.75 }}
          >
            A modern medical booking experience for patients, doctors, and administrators — with
            secure workflows and transparent scheduling.
          </p>
          {/* Social icons */}
          <div className="d-flex gap-2 mt-4">
            {["bi-facebook", "bi-twitter-x", "bi-instagram", "bi-linkedin"].map((icon) => (
              <div
                key={icon}
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: 36,
                  height: 36,
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "background 140ms, color 140ms",
                }}
              >
                <i className={`bi ${icon}`} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Platform</p>
          <div className="footer-links">
            {footerColumns.platform.map(({ icon, label }) => (
              <span key={label}>
                <i className={`bi ${icon}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Company</p>
          <div className="footer-links">
            {footerColumns.company.map(({ icon, label }) => (
              <span key={label}>
                <i className={`bi ${icon}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Contact</p>
          <div className="footer-links">
            {footerColumns.contact.map(({ icon, label }) => (
              <span key={label}>
                <i className={`bi ${icon}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Doctor Book. All rights reserved.</span>
        <div className="footer-bottom-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Data Security</span>
        </div>
      </div>
    </Container>
  </footer>
);

export default AppFooter;
