import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import ChauffeurDashboard from "../components/dashboard/ChauffeurDashboard";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isDashboardRoot = location.pathname === "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* Sidebar */}
      <div 
        className="bg-white shadow-sm"
        style={{ 
          width: sidebarCollapsed ? "80px" : "280px",
          transition: "width 0.3s ease",
          borderRight: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden"
        }}
      >
        {/* Logo & Brand */}
        <div className="p-4 border-bottom" style={{ backgroundColor: "#2563eb" }}>
          <div className="d-flex align-items-center justify-content-between">
            {!sidebarCollapsed && (
              <div className="text-white">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-truck-moving me-2"></i>
                  SuiviTraje
                </h5>
                <small className="text-white-50">Gestion Transport</small>
              </div>
            )}
            <button 
              className="btn btn-link text-white p-0" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ fontSize: "1.2rem" }}
            >
              <i className={`fas fa-${sidebarCollapsed ? 'angles-right' : 'angles-left'}`}></i>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-3 border-bottom bg-light">
          <div className="d-flex align-items-center">
            <div 
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
              style={{ width: "45px", height: "45px", flexShrink: 0 }}
            >
              <i className="fas fa-user fa-lg"></i>
            </div>
            {!sidebarCollapsed && (
              <div className="ms-3 overflow-hidden">
                <div className="fw-bold text-truncate">{user?.nom}</div>
                <small className="text-muted d-block text-truncate">{user?.email}</small>
                <span className="badge bg-primary mt-1" style={{ fontSize: "0.7rem" }}>
                  <i className={`fas fa-${user?.role === 'Admin' ? 'user-shield' : 'user-tie'} me-1`}></i>
                  {user?.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        {user?.role === "Admin" && (
          <nav className="py-3">
            <NavLink 
              to="/dashboard" 
              end
              className={({ isActive }) => 
                `d-flex align-items-center px-4 py-3 text-decoration-none ${
                  isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'
                }`
              }
              style={{ transition: "all 0.2s" }}
            >
              <i className="fas fa-home" style={{ width: "20px" }}></i>
              {!sidebarCollapsed && <span className="ms-3">Accueil</span>}
            </NavLink>
            
            <NavLink 
              to="/dashboard/camions"
              className={({ isActive }) => 
                `d-flex align-items-center px-4 py-3 text-decoration-none ${
                  isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'
                }`
              }
              style={{ transition: "all 0.2s" }}
            >
              <i className="fas fa-truck" style={{ width: "20px" }}></i>
              {!sidebarCollapsed && <span className="ms-3">Camions</span>}
            </NavLink>

            <NavLink 
              to="/dashboard/remorques"
              className={({ isActive }) => 
                `d-flex align-items-center px-4 py-3 text-decoration-none ${
                  isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'
                }`
              }
              style={{ transition: "all 0.2s" }}
            >
              <i className="fas fa-trailer" style={{ width: "20px" }}></i>
              {!sidebarCollapsed && <span className="ms-3">Remorques</span>}
            </NavLink>

            <NavLink 
              to="/dashboard/pneus"
              className={({ isActive }) => 
                `d-flex align-items-center px-4 py-3 text-decoration-none ${
                  isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'
                }`
              }
              style={{ transition: "all 0.2s" }}
            >
              <i className="fas fa-circle-notch" style={{ width: "20px" }}></i>
              {!sidebarCollapsed && <span className="ms-3">Pneus</span>}
            </NavLink>

            <NavLink 
              to="/dashboard/trajets"
              className={({ isActive }) => 
                `d-flex align-items-center px-4 py-3 text-decoration-none ${
                  isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'
                }`
              }
              style={{ transition: "all 0.2s" }}
            >
              <i className="fas fa-route" style={{ width: "20px" }}></i>
              {!sidebarCollapsed && <span className="ms-3">Trajets</span>}
            </NavLink>

            <NavLink 
              to="/dashboard/maintenances"
              className={({ isActive }) => 
                `d-flex align-items-center px-4 py-3 text-decoration-none ${
                  isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'
                }`
              }
              style={{ transition: "all 0.2s" }}
            >
              <i className="fas fa-tools" style={{ width: "20px" }}></i>
              {!sidebarCollapsed && <span className="ms-3">Maintenances</span>}
            </NavLink>
          </nav>
        )}

        {/* Logout Button */}
        <div className="p-3 border-top mt-auto" style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <button 
            className={`btn btn-outline-danger w-100 ${sidebarCollapsed ? 'p-2' : ''}`}
            onClick={handleLogout}
            title="Déconnexion"
          >
            <i className="fas fa-sign-out-alt"></i>
            {!sidebarCollapsed && <span className="ms-2">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Header */}
        <header className="bg-white shadow-sm py-3 px-4 border-bottom sticky-top">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0 fw-bold text-dark">
                <i className={`fas fa-${user?.role === 'Admin' ? 'cogs' : 'tachometer-alt'} me-2 text-primary`}></i>
                {user?.role === "Admin" ? "Tableau de bord Administrateur" : "Tableau de bord Chauffeur"}
              </h4>
              <small className="text-muted">
                <i className="far fa-calendar-alt me-1"></i>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-light rounded-circle" style={{ width: "40px", height: "40px" }}>
                <i className="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
          {isDashboardRoot ? (
            user?.role === "Admin" ? <AdminDashboard /> : <ChauffeurDashboard />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
