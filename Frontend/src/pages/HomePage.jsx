import { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DoctorCard from "../components/common/DoctorCard";
import { fetchDoctors } from "../features/doctors/doctorsSlice";

const services = [
  {
    icon: "bi-person-badge",
    title: "Specialist Consultations",
    text: "Book structured consultations across general medicine, gynecology, cardiology, and specialist follow-up care.",
  },
  {
    icon: "bi-clipboard2-pulse",
    title: "Diagnostics Coordination",
    text: "Manage scans, assessment scheduling, and procedure-day coordination from one unified system.",
  },
  {
    icon: "bi-chat-square-text",
    title: "Second Opinion Access",
    text: "Connect with trusted specialists quickly when patients need more confidence in their treatment plan.",
  },
  {
    icon: "bi-graph-up-arrow",
    title: "Long-term Follow-up",
    text: "Track appointment history, visit outcomes, and future care planning through secure dashboards.",
  },
];

const whyUs = [
  { icon: "bi-patch-check-fill",    title: "Verified Doctors",        text: "Every specialist is verified with visible credentials, specialization, and transparent consultation details." },
  { icon: "bi-shield-lock-fill",    title: "Protected Access",         text: "Role-based accounts ensure only approved doctors and authenticated patients access relevant features." },
  { icon: "bi-calendar2-check-fill",title: "Slot-level Scheduling",    text: "Real-time slot availability with conflict detection prevents double-bookings and missed appointments." },
  { icon: "bi-speedometer2",        title: "Admin Oversight",          text: "Platform-wide visibility for approvals, user management, and appointment reporting in real time." },
  { icon: "bi-heart-pulse-fill",    title: "Holistic Care",            text: "Support from first consultation through diagnostics, treatment, and long-term follow-up planning." },
  { icon: "bi-telephone-fill",      title: "365-day Support",          text: "Care coordination is available six days a week with a dedicated priority line for complex cases." },
];

const testimonials = [
  {
    name: "Ritika & Arjun",
    role: "Patient",
    quote:
      "The booking flow felt calm and clear — from the first consultation request all the way through to follow-up.",
  },
  {
    name: "Neha S.",
    role: "Patient",
    quote:
      "Being able to compare specialists, view their details, and reserve a slot without calling three clinics saved us enormous stress.",
  },
  {
    name: "Kavya M.",
    role: "Patient",
    quote:
      "The dashboard made it easy to track bookings, payment status, and doctor responses — everything in one place.",
  },
];

const locations = ["Bengaluru", "Delhi", "Mumbai", "Hyderabad", "Chennai", "Pune"];

const pathways = [
  { n: "01", title: "Planning your first consultation",      icon: "bi-calendar2-plus" },
  { n: "02", title: "Managing ongoing health concerns",      icon: "bi-activity" },
  { n: "03", title: "Finding the right specialist care",     icon: "bi-search-heart" },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchDoctors({ limit: 50 }));
  }, [dispatch]);

  return (
    <>
      {/* ════════════════════════════════════════════
          HERO — full-width photo with dark overlay
      ════════════════════════════════════════════ */}
      <section className="hero-section">
        <Container style={{ position: "relative", zIndex: 1 }}>
          <Row>
            <Col lg={8} xl={7}>
              <span className="eyebrow eyebrow-light mb-4 d-inline-flex">
                <i className="bi bi-heart-pulse" />
                Compassionate specialist care
              </span>

              <h1 className="hero-title mt-3">
                Helping families find the right doctor with confidence.
              </h1>

              <p
                className="mt-4 mb-0"
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "1.05rem",
                  lineHeight: 1.75,
                  maxWidth: "52ch",
                }}
              >
                A unified booking platform that brings together specialist discovery, scheduling,
                doctor approvals, and patient dashboards — in one trusted workflow.
              </p>

              <div className="d-flex gap-3 flex-wrap mt-5">
                <Button
                  as={Link}
                  to="/doctors"
                  size="lg"
                  className="pill-button btn-teal"
                >
                  Book an Appointment
                  <i className="bi bi-arrow-right ms-2" />
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-light"
                  size="lg"
                  className="pill-button"
                >
                  Create Account
                </Button>
              </div>

              {/* Stats row */}
              <div className="hero-stats-row mt-5">
                {[
                  ["65%",   "IVF Success Rate"],
                  ["5000+", "Patients Supported"],
                  ["10+",   "Years of Trust"],
                ].map(([val, label]) => (
                  <div key={label} className="hero-stat">
                    <strong>{val}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ════════════════════════════════════════════
          TRUST BAND
      ════════════════════════════════════════════ */}
      <section
        className="py-4"
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
      >
        <Container>
          <div className="trust-band">
            {[
              ["bi-patch-check-fill",  "Verified specialists"],
              ["bi-shield-lock-fill",  "Protected patient access"],
              ["bi-calendar2-check",   "Slot-level scheduling"],
              ["bi-award-fill",        "Holistic care, 365 days"],
            ].map(([icon, item]) => (
              <div key={item} className="trust-pill">
                <i className={`bi ${icon}`} />
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════
          CARE PATHWAYS
      ════════════════════════════════════════════ */}
      <section className="py-5 py-lg-6">
        <Container>
          <div className="section-heading text-center mb-5 mx-auto">
            <span className="eyebrow">Care pathways</span>
            <h2 className="mt-3">Supporting every stage of the patient journey</h2>
            <p className="text-muted mt-2 mb-0" style={{ lineHeight: 1.75 }}>
              From first consultation to long-term follow-up — every step is handled in one system.
            </p>
          </div>
          <Row className="g-4">
            {pathways.map(({ n, title, icon }) => (
              <Col md={4} key={n}>
                <Card className="journey-card h-100 border-0 p-1">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="icon-circle">
                        <i className={`bi ${icon}`} />
                      </div>
                      <span className="journey-index">{n}</span>
                    </div>
                    <h5 className="mb-2">{title}</h5>
                    <p className="text-muted mb-0" style={{ fontSize: "0.875rem", lineHeight: 1.7 }}>
                      Smooth transitions from discovery to booking, consultation, and follow-up care.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ════════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════════ */}
      <section className="py-5 py-lg-6 warm-section">
        <Container>
          <Row className="align-items-end g-4 mb-5">
            <Col lg={6}>
              <span className="eyebrow">Our Services</span>
              <h2 className="mt-3">Built for structured, reliable healthcare booking</h2>
            </Col>
            <Col lg={6}>
              <p className="text-muted mb-0" style={{ lineHeight: 1.75 }}>
                Every service area is designed to reduce friction and build patient confidence
                from the first click to the final follow-up.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {services.map((s) => (
              <Col md={6} key={s.title}>
                <Card className="service-card border-0 h-100 p-1">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start gap-3">
                      <div className="icon-circle flex-shrink-0">
                        <i className={`bi ${s.icon}`} />
                      </div>
                      <div>
                        <span className="service-kicker">Service area</span>
                        <h5 className="mb-2">{s.title}</h5>
                        <p className="text-muted mb-0" style={{ fontSize: "0.875rem", lineHeight: 1.7 }}>
                          {s.text}
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED DOCTORS
      ════════════════════════════════════════════ */}
      <section className="py-5 py-lg-6">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
            <div className="section-heading">
              <span className="eyebrow">Our Specialists</span>
              <h2 className="mt-3">Meet our verified doctors</h2>
              <p className="text-muted mt-2 mb-0">
                Profiles include credentials, availability, consultation fees, and real booking status.
              </p>
            </div>
            <Button
              as={Link}
              to="/doctors"
              className="pill-button btn-outline-teal flex-shrink-0"
            >
              View all doctors
              <i className="bi bi-arrow-right ms-2" />
            </Button>
          </div>
          <Row className="g-4">
            {doctors.map((doctor) => (
              <Col md={6} lg={4} key={doctor._id}>
                <DoctorCard doctor={doctor} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ════════════════════════════════════════════
          WHY CHOOSE US — dark navy section
      ════════════════════════════════════════════ */}
      <section className="py-5 py-lg-6 deep-section">
        <Container>
          <Row className="align-items-end g-4 mb-5">
            <Col lg={6}>
              <span className="eyebrow eyebrow-light">Why Choose Us</span>
              <h2 className="text-white mt-3">
                Built to feel reassuring, ethical, and transparent
              </h2>
            </Col>
            <Col lg={6}>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 0 }}>
                A calm, credibility-first design focused on what matters: the right doctor, the
                right time, and the right outcome for every patient.
              </p>
            </Col>
          </Row>
          <Row className="g-3">
            {whyUs.map((item) => (
              <Col md={6} lg={4} key={item.title}>
                <Card className="deep-card border-0 h-100">
                  <Card.Body className="p-4">
                    <div
                      className="icon-circle icon-circle-dark mb-3"
                      style={{ width: 44, height: 44, fontSize: "1.1rem" }}
                    >
                      <i className={`bi ${item.icon}`} />
                    </div>
                    <h6
                      className="mb-2"
                      style={{ color: "white", fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
                    >
                      {item.title}
                    </h6>
                    <p className="mb-0">{item.text}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button as={Link} to="/register" variant="light" size="lg" className="pill-button">
              Get started free
              <i className="bi bi-arrow-right ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════ */}
      <section className="py-5 py-lg-6">
        <Container>
          <div className="section-heading text-center mb-5 mx-auto">
            <span className="eyebrow">Patient stories</span>
            <h2 className="mt-3">This could be your story</h2>
            <p className="text-muted mt-2 mb-0">
              Real experiences from patients who found their specialist through Doctor Book.
            </p>
          </div>
          <Row className="g-4">
            {testimonials.map((item) => (
              <Col md={4} key={item.name}>
                <Card className="testimonial-card h-100 border-0 p-1">
                  <Card.Body className="p-4">
                    <div className="d-flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className="bi bi-star-fill"
                          style={{ color: "#f59e0b", fontSize: "0.8rem" }}
                        />
                      ))}
                    </div>
                    <p className="testimonial-quote mb-4">"{item.quote}"</p>
                    <div className="d-flex align-items-center gap-3 pt-3"
                      style={{ borderTop: "1px solid var(--border)" }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: 38,
                          height: 38,
                          background: "var(--teal-soft)",
                          color: "var(--teal-dark)",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.name[0]}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            color: "var(--text)",
                          }}
                        >
                          {item.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{item.role}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ════════════════════════════════════════════
          LOCATIONS
      ════════════════════════════════════════════ */}
      <section className="py-5 warm-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={4}>
              <span className="eyebrow">
                <i className="bi bi-geo-alt-fill" />
                Our coverage
              </span>
              <h2 className="mt-3">
                Specialists across India's major cities
              </h2>
              <p className="text-muted mt-3 mb-4" style={{ lineHeight: 1.75 }}>
                Book with verified specialists in your city and benefit from local care coordination.
              </p>
              <Button as={Link} to="/doctors" className="pill-button btn-teal">
                Find specialists near you
                <i className="bi bi-arrow-right ms-2" />
              </Button>
            </Col>
            <Col lg={8}>
              <div className="locations-grid">
                {locations.map((city) => (
                  <div key={city} className="location-chip">
                    <i
                      className="bi bi-geo-alt"
                      style={{ color: "var(--teal)", marginRight: 6, fontSize: "0.9rem" }}
                    />
                    {city}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ════════════════════════════════════════════
          FINAL CTA — dark navy with teal glow
      ════════════════════════════════════════════ */}
      <section className="py-5 py-lg-6">
        <Container>
          <div className="appointment-cta text-center">
            <span className="eyebrow eyebrow-light d-inline-flex mb-4">
              <i className="bi bi-calendar-plus" />
              Book an Appointment
            </span>
            <h2
              className="mb-3 text-white"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}
            >
              Find a doctor that matches your needs
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                maxWidth: 480,
                margin: "0 auto 2rem",
                lineHeight: 1.75,
              }}
            >
              Search specialists, review profiles, and confirm a consultation from a single
              booking experience.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button as={Link} to="/doctors" size="lg" className="pill-button btn-teal">
                <i className="bi bi-search me-2" />
                Explore Doctors
              </Button>
              <Button
                as={Link}
                to="/register"
                variant="outline-light"
                size="lg"
                className="pill-button"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
