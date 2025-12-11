import PneuDashboard from "../components/dashboard/PneuDashboard";

export default function PneusPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">
          <i className="fas fa-circle-notch text-primary me-2"></i>
          Gestion des Pneus
        </h2>
        <p className="text-muted">Gérez vos pneumatiques</p>
      </div>
      <PneuDashboard />
    </div>
  );
}
