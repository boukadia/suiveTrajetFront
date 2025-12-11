import CamionDashboard from "../components/dashboard/CamionDashboard";

export default function CamionsPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">
          <i className="fas fa-truck text-primary me-2"></i>
          Gestion des Camions
        </h2>
        <p className="text-muted">Gérez votre flotte de camions</p>
      </div>
      <CamionDashboard />
    </div>
  );
}
