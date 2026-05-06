import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { currency } from "../../utils/formatters";
import StatusBadge from "./StatusBadge";

const DoctorCard = ({ doctor }) => {
  const imageUrl = doctor.profileImage
    ? `http://localhost:5000${doctor.profileImage}`
    : "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80";

  return (
    <Card className="doctor-card doctor-directory-card h-100 border-0">
      <Card.Body className="p-4">
        <div className="doctor-directory-top">
          <img src={imageUrl} alt={doctor.user?.name} className="doctor-directory-avatar" />
          <div className="doctor-directory-main">
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <h5 className="mb-1 doctor-card-title">{doctor.user?.name}</h5>
                <p className="doctor-directory-specialization mb-1">{doctor.specialization}</p>
                <p className="doctor-directory-qualification mb-0">
                  {doctor.qualifications?.length
                    ? doctor.qualifications.join(", ")
                    : "Consultation available"}
                </p>
              </div>
              <StatusBadge value={doctor.isApproved ? "Available" : "Reviewing"} />
            </div>
          </div>
        </div>

        <div className="doctor-directory-chip-row">
          <div className="doctor-directory-chip">
            <i className="bi bi-briefcase" />
            <span>{doctor.experience}+ years</span>
          </div>
          <div className="doctor-directory-chip">
            <i className="bi bi-geo-alt" />
            <span>{doctor.location}</span>
          </div>
          <div className="doctor-directory-chip">
            <i className="bi bi-cash-coin" />
            <span>{currency(doctor.fees)}</span>
          </div>
        </div>

        <div className="doctor-directory-actions mt-4">
          <Button as={Link} to={`/doctors/${doctor._id}`} className="doctor-directory-btn doctor-directory-btn-outline text-center">
            View Profile
          </Button>
          <Button as={Link} to={`/booking/${doctor._id}`} className="doctor-directory-btn btn-teal text-center">
            Book Appointment
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;
