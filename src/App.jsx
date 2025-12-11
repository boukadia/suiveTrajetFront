import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import CamionsPage from "./pages/CamionsPage";
import RemorquesPage from "./pages/RemorquesPage";
import PneusPage from "./pages/PneusPage";
import TrajetsPage from "./pages/TrajetsPage";
import MaintenancesPage from "./pages/MaintenancesPage";
// import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="camions" element={<CamionsPage />} />
            <Route path="remorques" element={<RemorquesPage />} />
            <Route path="pneus" element={<PneusPage />} />
            <Route path="trajets" element={<TrajetsPage />} />
            <Route path="maintenances" element={<MaintenancesPage />} />
          </Route>
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
