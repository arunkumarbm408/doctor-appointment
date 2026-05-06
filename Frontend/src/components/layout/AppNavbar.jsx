import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

const AppNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="site-header sticky-top">
      {/* Topbar */}
      <div className="topbar-shell">
        <Container className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="topbar-copy">
            <i className="bi bi-shield-check me-1" />
            Trusted specialist booking &amp; coordinated patient care
          </span>
          <div className="d-flex gap-3 flex-wrap topbar-meta">
            <span><i className="bi bi-clock" /> Mon – Sat: 8 AM – 8 PM</span>
            <span><i className="bi bi-envelope" /> care@doctorbook.com</span>
            <span><i className="bi bi-telephone-fill" /> 080-45309999</span>
          </div>
        </Container>
      </div>

      {/* Main navbar */}
      <Navbar expand="lg" className="nav-shell">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-mark">
            <span className="brand-badge">DB</span>
            <span>
              <strong>Doctor Book</strong>
              <small>Specialist Appointment Platform</small>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" className="border-0 shadow-none" />

          <Navbar.Collapse id="main-nav">
            <Nav className="mx-auto nav-center">
              <Nav.Link as={NavLink} to="/" end className="nav-link-soft">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/doctors" className="nav-link-soft">
                Find Doctors
              </Nav.Link>
              {user && (
                <Nav.Link
                  as={NavLink}
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="nav-link-soft"
                >
                  Dashboard
                </Nav.Link>
              )}
            </Nav>

            <div className="d-flex gap-2 align-items-center nav-actions">
              {/* Phone CTA — visible on large screens */}
              <a
                href="tel:08045309999"
                className="d-none d-xl-flex align-items-center gap-2 me-2"
                style={{
                  color: "var(--teal-dark)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                <i className="bi bi-telephone-fill" style={{ color: "var(--teal)" }} />
                080-45309999
              </a>

              {user ? (
                <>
                  <div className="user-chip">
                    <span className="user-chip-role">{user.role}</span>
                    <strong>{user.name}</strong>
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="pill-button"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-secondary"
                    size="sm"
                    className="pill-button"
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    size="sm"
                    className="pill-button btn-teal"
                  >
                    Book Appointment
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default AppNavbar;
