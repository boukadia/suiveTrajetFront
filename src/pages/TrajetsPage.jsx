import TrajetDashboard from "../components/dashboard/TrajetDashboard";

export default function TrajetsPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">
          <i className="fas fa-route text-primary me-2"></i>
          Gestion des Trajets
        </h2>
        <p className="text-muted">Suivez et gérez vos trajets</p>
      </div>
      <TrajetDashboard />
    </div>
  );
}
