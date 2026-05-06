import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import AppointmentTable from "../components/common/AppointmentTable";
import { fetchMyAppointments, cancelAppointment } from "../features/appointments/appointmentsSlice";
import {
  fetchDoctorAppointments,
  saveDoctorProfile,
  updateAppointmentStatus,
} from "../features/doctors/doctorsSlice";

const StatCard = ({ icon, label, value }) => (
  <Card className="border-0 stat-card premium-stat-card h-100">
    <Card.Body className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span>{label}</span>
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{ width: 36, height: 36, background: "rgba(255,255,255,0.1)", fontSize: "1.1rem" }}
        >
          <i className={`bi ${icon}`} />
        </div>
      </div>
      <h3>{value}</h3>
    </Card.Body>
  </Card>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, doctorProfile } = useSelector((state) => state.auth);
  const { appointments } = useSelector((state) => state.appointments);
  const { doctorAppointments, actionLoading, error } = useSelector((state) => state.doctors);

  const [profileForm, setProfileForm] = useState({
    specialization: doctorProfile?.specialization || "",
    experience:     doctorProfile?.experience     || "",
    fees:           doctorProfile?.fees           || "",
    location:       doctorProfile?.location       || "",
    about:          doctorProfile?.about          || "",
    qualifications: doctorProfile?.qualifications?.join(", ") || "",
    availabilitySlots: JSON.stringify(
      doctorProfile?.availabilitySlots || [{ day: "Monday", startTime: "10:00", endTime: "13:00" }],
      null,
      2
    ),
    profileImage: null,
  });

  useEffect(() => {
    if (doctorProfile) {
      setProfileForm({
        specialization:    doctorProfile.specialization || "",
        experience:        doctorProfile.experience     || "",
        fees:              doctorProfile.fees           || "",
        location:          doctorProfile.location       || "",
        about:             doctorProfile.about          || "",
        qualifications:    doctorProfile.qualifications?.join(", ") || "",
        availabilitySlots: JSON.stringify(doctorProfile.availabilitySlots || [], null, 2),
        profileImage: null,
      });
    }
  }, [doctorProfile]);

  useEffect(() => {
    if (user?.role === "patient") dispatch(fetchMyAppointments());
    if (user?.role === "doctor")  dispatch(fetchDoctorAppointments());
  }, [dispatch, user]);

  const doctorMetrics = useMemo(
    () => ({
      total:    doctorAppointments.length,
      pending:  doctorAppointments.filter((a) => a.status === "Pending").length,
      approved: doctorAppointments.filter((a) => a.status === "Approved").length,
    }),
    [doctorAppointments]
  );

  const handleCancel       = (id) => dispatch(cancelAppointment(id));
  const handleStatusChange = (id, status) => dispatch(updateAppointmentStatus({ id, status }));

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(profileForm).forEach(([k, v]) => {
      if (v !== null) formData.append(k, v);
    });
    dispatch(saveDoctorProfile(formData));
  };

  const WelcomeChip = ({ roleIcon, role }) => (
    <div
      className="d-flex align-items-center gap-3 p-3 rounded-3"
      style={{ background: "var(--teal-soft)", border: "1.5px solid var(--teal-border)" }}
    >
      <i className={`bi ${roleIcon}`} style={{ fontSize: "1.75rem", color: "var(--teal)" }} />
      <div>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--teal)" }}>
          Signed in as {role}
        </div>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "var(--text)" }}>
          {user?.name}
        </div>
      </div>
    </div>
  );

  /* ── Patient view ── */
  if (user?.role === "patient") {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-5">
          <section className="page-hero">
            <span className="eyebrow">
              <i className="bi bi-person-heart" />
              Patient dashboard
            </span>
            <h1 className="page-title mt-3">Your consultations</h1>
            <p className="page-subtitle mt-2 mb-0">
              Track booking history, monitor status changes, and manage upcoming appointments.
            </p>
          </section>
          <WelcomeChip roleIcon="bi-person-heart" role="patient" />
        </div>

        <Card className="border-0 premium-panel">
          <Card.Body className="p-0">
            <div
              className="p-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h5 className="mb-0" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                <i className="bi bi-calendar2-week me-2" style={{ color: "var(--teal)" }} />
                All appointments
              </h5>
            </div>
            <div className="p-4">
              <AppointmentTable appointments={appointments} onCancel={handleCancel} />
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  /* ── Doctor view ── */
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-5">
        <section className="page-hero">
          <span className="eyebrow">
            <i className="bi bi-clipboard2-pulse" />
            Doctor dashboard
          </span>
          <h1 className="page-title mt-3">Your practice workspace</h1>
          <p className="page-subtitle mt-2 mb-0">
            Update your profile, publish availability, and respond to patient appointment requests.
          </p>
        </section>
        <WelcomeChip roleIcon="bi-person-badge" role="doctor" />
      </div>

      <Row className="g-4">
        {/* Profile form */}
        <Col lg={5}>
          <Card className="border-0 premium-panel">
            <Card.Body className="p-0">
              <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <h5 className="mb-0" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                  <i className="bi bi-person-vcard me-2" style={{ color: "var(--teal)" }} />
                  Doctor profile
                </h5>
              </div>
              <div className="p-4">
                {error && (
                  <Alert
                    variant="danger"
                    className="d-flex gap-2 py-2 mb-3"
                    style={{ borderRadius: "var(--r-md)" }}
                  >
                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                    {error}
                  </Alert>
                )}
                <Form onSubmit={handleProfileSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-soft">Specialization</Form.Label>
                    <Form.Control
                      className="form-control-soft"
                      placeholder="e.g. Cardiology"
                      value={profileForm.specialization}
                      onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Experience (years)</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="number"
                        min="0"
                        value={profileForm.experience}
                        onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Fees (₹)</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="number"
                        min="0"
                        value={profileForm.fees}
                        onChange={(e) => setProfileForm({ ...profileForm, fees: e.target.value })}
                        required
                      />
                    </Col>
                  </Row>
                  <Form.Group className="mt-3">
                    <Form.Label className="form-label-soft">Location</Form.Label>
                    <Form.Control
                      className="form-control-soft"
                      placeholder="e.g. Bengaluru"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="form-label-soft">About</Form.Label>
                    <Form.Control
                      className="form-control-soft"
                      as="textarea"
                      rows={3}
                      placeholder="Your care philosophy and approach…"
                      value={profileForm.about}
                      onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="form-label-soft">Qualifications</Form.Label>
                    <Form.Control
                      className="form-control-soft"
                      placeholder="MBBS, MD, DNB…"
                      value={profileForm.qualifications}
                      onChange={(e) => setProfileForm({ ...profileForm, qualifications: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="form-label-soft">Availability slots (JSON)</Form.Label>
                    <Form.Control
                      className="form-control-soft code-like"
                      as="textarea"
                      rows={6}
                      value={profileForm.availabilitySlots}
                      onChange={(e) => setProfileForm({ ...profileForm, availabilitySlots: e.target.value })}
                    />
                    <Form.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Format: [&#123;"day":"Monday","startTime":"10:00","endTime":"13:00"&#125;]
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label className="form-label-soft">Profile image</Form.Label>
                    <Form.Control
                      className="form-control-soft"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.files[0] })}
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="mt-4 pill-button btn-teal w-100"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <i className="bi bi-floppy me-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Stats + appointments */}
        <Col lg={7}>
          <Row className="g-3 mb-4">
            <Col md={4}>
              <StatCard icon="bi-calendar2-week"  label="Total"    value={doctorMetrics.total} />
            </Col>
            <Col md={4}>
              <StatCard icon="bi-hourglass-split" label="Pending"  value={doctorMetrics.pending} />
            </Col>
            <Col md={4}>
              <StatCard icon="bi-check2-circle"   label="Approved" value={doctorMetrics.approved} />
            </Col>
          </Row>

          <Card className="border-0 premium-panel">
            <Card.Body className="p-0">
              <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <h5 className="mb-0" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                  <i className="bi bi-calendar-event me-2" style={{ color: "var(--teal)" }} />
                  Appointment requests
                </h5>
              </div>
              <div className="p-4">
                <AppointmentTable
                  appointments={doctorAppointments}
                  onStatusChange={handleStatusChange}
                  showDoctorActions
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
