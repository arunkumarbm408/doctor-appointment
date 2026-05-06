import { useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DoctorCard from "../components/common/DoctorCard";
import { fetchDoctors } from "../features/doctors/doctorsSlice";

const filterSuggestions = (options, value) => {
  const term = value.trim().toLowerCase();
  if (!term) {
    return [];
  }

  return options
    .filter((option) => option.toLowerCase().includes(term))
    .slice(0, 6);
};

const DoctorsPage = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.doctors);
  const [filters, setFilters] = useState({ specialization: "", location: "" });
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const specializationOptions = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean))].sort(),
    [doctors]
  );

  const locationOptions = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.location).filter(Boolean))].sort(),
    [doctors]
  );

  const specializationSuggestions = useMemo(
    () => filterSuggestions(specializationOptions, filters.specialization),
    [specializationOptions, filters.specialization]
  );

  const locationSuggestions = useMemo(
    () => filterSuggestions(locationOptions, filters.location),
    [locationOptions, filters.location]
  );

  const handleSearch = async (event) => {
    event.preventDefault();
    setFallbackMessage("");
    setActiveMenu("");
    const result = await dispatch(fetchDoctors(filters));

    if (result.payload?.data && result.payload.data.length === 0) {
      setFallbackMessage("No exact match found. Showing all doctors instead.");
      dispatch(fetchDoctors());
    }
  };

  const handleReset = () => {
    setFilters({ specialization: "", location: "" });
    setFallbackMessage("");
    setActiveMenu("");
    dispatch(fetchDoctors());
  };

  const selectSuggestion = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setActiveMenu("");
  };

  return (
    <section className="doctor-directory-page py-5">
      <Container>
        <section className="doctor-directory-hero text-center mb-5">
          <span className="eyebrow">Doctor Directory</span>
          <h1 className="doctor-directory-title mt-3">Book consultation with top specialists near you</h1>
          <p className="doctor-directory-subtitle mt-3 mb-0">
            Browse doctors by specialization and location, compare experience, and confirm your appointment in a simple,
            consultation-first flow.
          </p>
        </section>

        <Form className="doctor-directory-search mb-5" onSubmit={handleSearch}>
          <Row className="g-3 align-items-end">
            <Col lg={4}>
              <Form.Label className="form-label-soft">Specialization</Form.Label>
              <div className="typeahead-wrap">
                <Form.Control
                  className="form-control-soft"
                  placeholder="e.g. Cardiology, Gynecology"
                  value={filters.specialization}
                  onFocus={() => setActiveMenu("specialization")}
                  onChange={(e) => {
                    setFilters({ ...filters, specialization: e.target.value });
                    setActiveMenu("specialization");
                  }}
                  onBlur={() => setTimeout(() => setActiveMenu(""), 120)}
                />
                {activeMenu === "specialization" && specializationSuggestions.length > 0 && (
                  <div className="typeahead-menu">
                    {specializationSuggestions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="typeahead-item"
                        onMouseDown={() => selectSuggestion("specialization", option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Col>

            <Col lg={3}>
              <Form.Label className="form-label-soft">Location</Form.Label>
              <div className="typeahead-wrap">
                <Form.Control
                  className="form-control-soft"
                  placeholder="e.g. Bengaluru, Mumbai"
                  value={filters.location}
                  onFocus={() => setActiveMenu("location")}
                  onChange={(e) => {
                    setFilters({ ...filters, location: e.target.value });
                    setActiveMenu("location");
                  }}
                  onBlur={() => setTimeout(() => setActiveMenu(""), 120)}
                />
                {activeMenu === "location" && locationSuggestions.length > 0 && (
                  <div className="typeahead-menu">
                    {locationSuggestions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="typeahead-item"
                        onMouseDown={() => selectSuggestion("location", option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Col>

            <Col md={3} className="d-flex gap-2">
              <Button type="submit" className="flex-fill doctor-directory-search-btn btn-teal">
                Search
              </Button>
              {(filters.specialization || filters.location) && (
                <Button type="button" variant="outline-secondary" className="pill-button" onClick={handleReset}>
                  <i className="bi bi-x-lg" />
                </Button>
              )}
            </Col>
          </Row>
        </Form>

        {fallbackMessage && (
          <div className="alert alert-info border-0 premium-panel mb-4" role="alert">
            {fallbackMessage}
          </div>
        )}

        <Row className="g-4">
          {loading && (
            <Col xs={12}>
              <div className="d-flex align-items-center gap-3 text-muted py-4">
                <span className="spinner-border spinner-border-sm" role="status" />
                Loading specialists...
              </div>
            </Col>
          )}

          {!loading && !doctors.length && (
            <Col xs={12}>
              <div className="empty-state-panel">
                <i className="bi bi-search d-block mb-3" style={{ fontSize: "2.5rem", color: "var(--teal-border)" }} />
                <h5 style={{ color: "var(--text-2)" }}>No doctors matched your filters</h5>
                <p className="text-muted mb-3">
                  Try a broader specialization or another city. You can also clear filters to browse the full directory.
                </p>
                <Button className="pill-button btn-outline-teal" size="sm" onClick={handleReset}>
                  Clear filters
                </Button>
              </div>
            </Col>
          )}

          {!loading &&
            doctors.map((doctor) => (
              <Col md={6} lg={4} key={doctor._id}>
                <DoctorCard doctor={doctor} />
              </Col>
            ))}
        </Row>
      </Container>
    </section>
  );
};

export default DoctorsPage;
