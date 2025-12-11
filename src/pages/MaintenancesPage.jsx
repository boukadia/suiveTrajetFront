import MaintenanceDashboard from "../components/dashboard/MaintenanceDashboard";

export default function MaintenancesPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">
          <i className="fas fa-tools text-primary me-2"></i>
          Gestion des Maintenances
        </h2>
        <p className="text-muted">Planifiez et suivez les maintenances</p>
      </div>
      <MaintenanceDashboard />
    </div>
  );
}
