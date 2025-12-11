import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchTrajets } from "../../api/trajetApi";

export default function ChauffeurDashboard() {
  const { user } = useContext(AuthContext);
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    enCours: 0,
    termines: 0,
    annules: 0
  });

  useEffect(() => {
    loadTrajets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadTrajets = async () => {
    try {
      const data = await fetchTrajets();
      // Filter trajets by chauffeur email
      const mesTrajets = data.filter(t => t.chauffeur === user?.email);
      setTrajets(mesTrajets);
      
      // Calculate stats
      setStats({
        total: mesTrajets.length,
        enCours: mesTrajets.filter(t => t.statut === "En cours").length,
        termines: mesTrajets.filter(t => t.statut === "Terminé").length,
        annules: mesTrajets.filter(t => t.statut === "Annulé").length
      });
    } catch (error) {
      console.error("Erreur lors du chargement des trajets:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-4">
        <h2 className="fw-bold mb-2">
          <i className="fas fa-tachometer-alt text-primary me-2"></i>
          Mes trajets
        </h2>
        <p className="text-muted">Bonjour {user?.nom}, voici vos trajets</p>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0" style={{ borderLeft: "4px solid #3b82f6" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Total</p>
                  <h3 className="fw-bold mb-0" style={{ color: "#3b82f6" }}>{stats.total}</h3>
                </div>
                <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                  <i className="fas fa-route text-primary fa-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0" style={{ borderLeft: "4px solid #f59e0b" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">En cours</p>
                  <h3 className="fw-bold mb-0" style={{ color: "#f59e0b" }}>{stats.enCours}</h3>
                </div>
                <div className="rounded-circle bg-warning bg-opacity-10 p-3">
                  <i className="fas fa-clock text-warning fa-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0" style={{ borderLeft: "4px solid #10b981" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Terminés</p>
                  <h3 className="fw-bold mb-0" style={{ color: "#10b981" }}>{stats.termines}</h3>
                </div>
                <div className="rounded-circle bg-success bg-opacity-10 p-3">
                  <i className="fas fa-check-circle text-success fa-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0" style={{ borderLeft: "4px solid #ef4444" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Annulés</p>
                  <h3 className="fw-bold mb-0" style={{ color: "#ef4444" }}>{stats.annules}</h3>
                </div>
                <div className="rounded-circle bg-danger bg-opacity-10 p-3">
                  <i className="fas fa-times-circle text-danger fa-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trajets List */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 fw-bold">
            <i className="fas fa-list me-2 text-primary"></i>
            Liste des trajets
          </h5>
        </div>
        <div className="card-body p-0">
          {trajets.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-route fa-3x text-muted mb-3"></i>
              <p className="text-muted">Aucun trajet trouvé</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Origine</th>
                    <th>Destination</th>
                    <th>Date départ</th>
                    <th>Date arrivée</th>
                    <th>Distance</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {trajets.map((trajet) => (
                    <tr key={trajet.id}>
                      <td className="fw-bold">#{trajet.id}</td>
                      <td>
                        <i className="fas fa-map-marker-alt text-success me-2"></i>
                        {trajet.origine}
                      </td>
                      <td>
                        <i className="fas fa-flag-checkered text-danger me-2"></i>
                        {trajet.destination}
                      </td>
                      <td>
                        <small className="text-muted">
                          <i className="far fa-calendar me-1"></i>
                          {new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}
                          <br />
                          <i className="far fa-clock me-1"></i>
                          {trajet.heureDepart}
                        </small>
                      </td>
                      <td>
                        <small className="text-muted">
                          <i className="far fa-calendar me-1"></i>
                          {new Date(trajet.dateArrivee).toLocaleDateString('fr-FR')}
                          <br />
                          <i className="far fa-clock me-1"></i>
                          {trajet.heureArrivee}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          <i className="fas fa-road me-1"></i>
                          {trajet.distance} km
                        </span>
                      </td>
                      <td>
                        <span 
                          className={`badge ${
                            trajet.statut === "Terminé" ? "bg-success" :
                            trajet.statut === "En cours" ? "bg-warning text-dark" :
                            trajet.statut === "Annulé" ? "bg-danger" :
                            "bg-secondary"
                          }`}
                        >
                          {trajet.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Info Alert */}
      <div className="alert alert-info mt-4 d-flex align-items-center" role="alert">
        <i className="fas fa-info-circle fa-2x me-3"></i>
        <div>
          <strong>Information:</strong> Seuls vos trajets personnels sont affichés. 
          Pour toute question, contactez votre administrateur.
        </div>
      </div>
    </div>
  );
}
