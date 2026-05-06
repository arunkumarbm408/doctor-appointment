import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, registerUser } from "../features/auth/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    role: "patient",
    specialization: "",
    experience: "",
    fees: "",
  });

  useEffect(() => {
    if (user) navigate(user.role === "admin" ? "/admin" : "/dashboard");
    return () => dispatch(clearAuthError());
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div style={{ background: "var(--bg-2)", minHeight: "100vh" }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={9} xl={8}>
            {/* Brand */}
            <div className="text-center mb-5">
              <Link to="/" className="brand-mark d-inline-flex justify-content-center mb-4">
                <span className="brand-badge">DB</span>
                <span className="text-start">
                  <strong>Doctor Book</strong>
                  <small>Specialist Appointment Platform</small>
                </span>
              </Link>
              <h1 className="page-title">Create your account</h1>
              <p className="page-subtitle mt-1">
                Patients can start booking right away. Doctors can set up their profile for approval.
              </p>
            </div>

            <Card className="border-0 premium-panel auth-card">
              <Card.Body className="p-4 p-md-5">
                {error && (
                  <Alert
                    variant="danger"
                    className="d-flex align-items-center gap-2 py-2 mb-4"
                    style={{ borderRadius: "var(--r-md)" }}
                  >
                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Account type selector */}
                  <div
                    className="mb-5 p-3 rounded-3"
                    style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}
                  >
                    <p className="mini-label mb-3">I am registering as a</p>
                    <div className="d-flex gap-3">
                      {[
                        { value: "patient", icon: "bi-person-heart",  label: "Patient" },
                        { value: "doctor",  icon: "bi-person-badge",  label: "Doctor" },
                      ].map(({ value, icon, label }) => (
                        <label
                          key={value}
                          className="d-flex align-items-center gap-2 rounded-3 px-4 py-3 flex-fill"
                          style={{
                            border: `2px solid ${form.role === value ? "var(--teal)" : "var(--border)"}`,
                            background: form.role === value ? "var(--teal-soft)" : "var(--surface)",
                            cursor: "pointer",
                            transition: "all 140ms",
                          }}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={value}
                            checked={form.role === value}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="visually-hidden"
                          />
                          <i
                            className={`bi ${icon}`}
                            style={{
                              color: form.role === value ? "var(--teal)" : "var(--text-3)",
                              fontSize: "1.2rem",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 700,
                              fontSize: "0.9rem",
                              color: form.role === value ? "var(--teal-dark)" : "var(--text-2)",
                            }}
                          >
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Personal info */}
                  <p className="mini-label mb-3">Personal information</p>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Full name</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="e.g. Dr. John Smith"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Email address</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Password</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Phone number</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="080-XXXXXXXX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </Col>
                    <Col md={12}>
                      <Form.Label className="form-label-soft">City / Location</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="e.g. Bengaluru"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        required
                      />
                    </Col>
                  </Row>

                  {/* Doctor fields */}
                  {form.role === "doctor" && (
                    <>
                      <hr style={{ borderColor: "var(--border)", marginBottom: "1.5rem" }} />
                      <p className="mini-label mb-3">Professional details</p>
                      <Row className="g-3 mb-4">
                        <Col md={12}>
                          <Form.Label className="form-label-soft">Specialization</Form.Label>
                          <Form.Control
                            className="form-control-soft"
                            placeholder="e.g. Cardiology, Gynecology"
                            value={form.specialization}
                            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label className="form-label-soft">Experience (years)</Form.Label>
                          <Form.Control
                            className="form-control-soft"
                            type="number"
                            min="0"
                            placeholder="e.g. 8"
                            value={form.experience}
                            onChange={(e) => setForm({ ...form, experience: e.target.value })}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label className="form-label-soft">Consultation fees (₹)</Form.Label>
                          <Form.Control
                            className="form-control-soft"
                            type="number"
                            min="0"
                            placeholder="e.g. 500"
                            value={form.fees}
                            onChange={(e) => setForm({ ...form, fees: e.target.value })}
                          />
                        </Col>
                      </Row>
                      <div
                        className="d-flex gap-2 p-3 rounded-3 mb-4"
                        style={{
                          background: "var(--teal-soft)",
                          border: "1px solid var(--teal-border)",
                        }}
                      >
                        <i
                          className="bi bi-info-circle-fill flex-shrink-0 mt-1"
                          style={{ color: "var(--teal)", fontSize: "0.875rem" }}
                        />
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.8rem",
                            color: "var(--teal-dark)",
                            lineHeight: 1.65,
                          }}
                        >
                          Doctor accounts require admin approval before appearing in search results.
                          You can complete your full profile from the dashboard after registration.
                        </p>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="pill-button btn-teal btn-soft-dark w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Creating account…
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2" />
                        Create account
                      </>
                    )}
                  </Button>
                </Form>

                <hr className="my-4" style={{ borderColor: "var(--border)" }} />
                <p
                  className="text-center mb-0"
                  style={{ fontSize: "0.875rem", color: "var(--text-3)" }}
                >
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "var(--teal-dark)", fontWeight: 700 }}>
                    Sign in
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
