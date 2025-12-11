import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCamions } from "../../api/camionApi";
import { fetchRemorques } from "../../api/remorqueApi";
import { fetchPneus } from "../../api/pneuApi";
import { fetchTrajets } from "../../api/trajetApi";
import { fetchMaintenances } from "../../api/maintenanceApi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    camions: { total: 0, actifs: 0, enMaintenance: 0 },
    remorques: { total: 0, actifs: 0, enMaintenance: 0 },
    pneus: { total: 0, neufs: 0, uses: 0 },
    trajets: { total: 0, enCours: 0, termines: 0 },
    maintenances: { total: 0, enCours: 0, terminees: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const [camions, remorques, pneus, trajets, maintenances] = await Promise.all([
        fetchCamions(),
        fetchRemorques(),
        fetchPneus(),
        fetchTrajets(),
        fetchMaintenances()
      ]);

      setStats({
        camions: {
          total: camions.length,
          actifs: camions.filter(c => c.statut === "Actif").length,
          enMaintenance: camions.filter(c => c.statut === "En maintenance").length
        },
        remorques: {
          total: remorques.length,
          actifs: remorques.filter(r => r.statut === "Actif").length,
          enMaintenance: remorques.filter(r => r.statut === "En maintenance").length
        },
        pneus: {
          total: pneus.length,
          neufs: pneus.filter(p => p.etat === "Neuf").length,
          uses: pneus.filter(p => p.etat === "Usé").length
        },
        trajets: {
          total: trajets.length,
          enCours: trajets.filter(t => t.statut === "En cours").length,
          termines: trajets.filter(t => t.statut === "Terminé").length
        },
        maintenances: {
          total: maintenances.length,
          enCours: maintenances.filter(m => m.statut === "En cours").length,
          terminees: maintenances.filter(m => m.statut === "Terminée").length
        }
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Camions",
      icon: "fa-truck",
      color: "#3b82f6",
      total: stats.camions.total,
      details: [
        { label: "Actifs", value: stats.camions.actifs, color: "#10b981" },
        { label: "En maintenance", value: stats.camions.enMaintenance, color: "#f59e0b" }
      ],
      path: "/dashboard/camions"
    },
    {
      title: "Remorques",
      icon: "fa-trailer",
      color: "#8b5cf6",
      total: stats.remorques.total,
      details: [
        { label: "Actifs", value: stats.remorques.actifs, color: "#10b981" },
        { label: "En maintenance", value: stats.remorques.enMaintenance, color: "#f59e0b" }
      ],
      path: "/dashboard/remorques"
    },
    {
      title: "Pneus",
      icon: "fa-circle-notch",
      color: "#ec4899",
      total: stats.pneus.total,
      details: [
        { label: "Neufs", value: stats.pneus.neufs, color: "#10b981" },
        { label: "Usés", value: stats.pneus.uses, color: "#ef4444" }
      ],
      path: "/dashboard/pneus"
    },
    {
      title: "Trajets",
      icon: "fa-route",
      color: "#06b6d4",
      total: stats.trajets.total,
      details: [
        { label: "En cours", value: stats.trajets.enCours, color: "#3b82f6" },
        { label: "Terminés", value: stats.trajets.termines, color: "#10b981" }
      ],
      path: "/dashboard/trajets"
    },
    {
      title: "Maintenances",
      icon: "fa-tools",
      color: "#f59e0b",
      total: stats.maintenances.total,
      details: [
        { label: "En cours", value: stats.maintenances.enCours, color: "#3b82f6" },
        { label: "Terminées", value: stats.maintenances.terminees, color: "#10b981" }
      ],
      path: "/dashboard/maintenances"
    }
  ];

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
          <i className="fas fa-chart-line text-primary me-2"></i>
          Vue d'ensemble
        </h2>
        <p className="text-muted">Statistiques en temps réel de votre flotte</p>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4">
        {statsCards.map((card, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div 
              className="card h-100 shadow-sm border-0 cursor-pointer"
              onClick={() => navigate(card.path)}
              style={{ 
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="text-muted mb-1">{card.title}</h6>
                    <h2 className="fw-bold mb-0" style={{ color: card.color }}>
                      {card.total}
                    </h2>
                  </div>
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      backgroundColor: `${card.color}20`
                    }}
                  >
                    <i className={`fas ${card.icon} fa-lg`} style={{ color: card.color }}></i>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-top">
                  {card.details.map((detail, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small">{detail.label}</span>
                      <span className="fw-bold" style={{ color: detail.color }}>
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <button 
                    className="btn btn-sm w-100"
                    style={{ 
                      backgroundColor: `${card.color}15`,
                      color: card.color,
                      border: "none"
                    }}
                  >
                    Voir les détails <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-4">
                <i className="fas fa-bolt text-warning me-2"></i>
                Actions rapides
              </h5>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate("/dashboard/camions")}
                  >
                    <i className="fas fa-plus-circle me-2"></i>
                    Nouveau camion
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate("/dashboard/trajets")}
                  >
                    <i className="fas fa-plus-circle me-2"></i>
                    Nouveau trajet
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate("/dashboard/maintenances")}
                  >
                    <i className="fas fa-wrench me-2"></i>
                    Planifier maintenance
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => loadStatistics()}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Rafraîchir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
