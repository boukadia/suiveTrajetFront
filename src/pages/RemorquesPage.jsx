import RemorqueDashboard from "../components/dashboard/RemorqueDashboard";

export default function RemorquesPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">
          <i className="fas fa-trailer text-primary me-2"></i>
          Gestion des Remorques
        </h2>
        <p className="text-muted">Gérez vos remorques</p>
      </div>
      <RemorqueDashboard />
    </div>
  );
}
