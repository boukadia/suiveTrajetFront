import React, { useState, useEffect } from "react";
import { fetchPneus, addPneu, updatePneu, deletePneu } from "../../api/pneuApi";
import { fetchCamions } from "../../api/camionApi";

export default function PneuDashboard() {
  const token = localStorage.getItem("token");
  const [pneus, setPneus] = useState([]);
  const [camions, setCamions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPneu, setNewPneu] = useState({ marque: "", modele: "", kilometrageInstallation: "", dateInstallation: "", status: "Neuf", camion: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pneusData, camionsData] = await Promise.all([
        fetchPneus(token),
        fetchCamions(token)
      ]);
      setPneus(pneusData);
      setCamions(camionsData);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newPneu.marque || !newPneu.modele) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }
    try {
      const data = await addPneu(newPneu, token);
      setPneus(prev => [...prev, data]);
      setNewPneu({ marque: "", modele: "", kilometrageInstallation: "", dateInstallation: "", status: "Neuf", camion: "" });
    } catch (err) {
      setError("Erreur lors de l'ajout");
    }
  };

  const startEdit = (pneu) => {
    setEditingId(pneu._id);
    setEditData({ 
      marque: pneu.marque, 
      modele: pneu.modele,
      kilometrageInstallation: pneu.kilometrageInstallation || "",
      dateInstallation: pneu.dateInstallation ? new Date(pneu.dateInstallation).toISOString().slice(0, 10) : "",
      status: pneu.status || "Neuf",
      camion: pneu.camion?._id || ""
    });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await updatePneu(id, editData, token);
      setPneus(prev => prev.map(p => p._id === id ? updated : p));
      setEditingId(null);
    } catch (err) {
      setError("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr ?")) return;
    try {
      await deletePneu(id, token);
      setPneus(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="text-center">Chargement...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gestion des Pneus</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Ajouter un pneu</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Marque *</label>
              <input type="text" className="form-control" value={newPneu.marque} onChange={e => setNewPneu({...newPneu, marque:e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Modèle *</label>
              <input type="text" className="form-control" value={newPneu.modele} onChange={e => setNewPneu({...newPneu, modele:e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Kilométrage Installation</label>
              <input type="number" className="form-control" value={newPneu.kilometrageInstallation} onChange={e => setNewPneu({...newPneu, kilometrageInstallation:e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date Installation</label>
              <input type="date" className="form-control" value={newPneu.dateInstallation} onChange={e => setNewPneu({...newPneu, dateInstallation:e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">État</label>
              <select className="form-select" value={newPneu.status} onChange={e => setNewPneu({...newPneu, status:e.target.value})}>
                <option value="Neuf">Neuf</option>
                <option value="Usé">Usé</option>
                <option value="A remplacer">A remplacer</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Camion</label>
              <select className="form-select" value={newPneu.camion} onChange={e => setNewPneu({...newPneu, camion:e.target.value})}>
                <option value="">-- Aucun --</option>
                {camions.map(c => <option key={c._id} value={c._id}>{c.numeroImmatriculation}</option>)}
              </select>
            </div>
            <div className="col-12">
              <button className="btn btn-primary" onClick={handleAdd}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Liste des pneus ({pneus.length})</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Km Installation</th>
                  <th>Date Installation</th>
                  <th>État</th>
                  <th>Camion</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pneus.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">Aucun pneu trouvé</td></tr>
                ) : (
                  pneus.map(p => (
                    <tr key={p._id}>
                      <td>{editingId === p._id ? <input type="text" className="form-control form-control-sm" value={editData.marque} onChange={e => setEditData({...editData, marque: e.target.value})} /> : p.marque}</td>
                      <td>{editingId === p._id ? <input type="text" className="form-control form-control-sm" value={editData.modele} onChange={e => setEditData({...editData, modele: e.target.value})} /> : p.modele}</td>
                      <td>{p.kilometrageInstallation || '-'}</td>
                      <td>{p.dateInstallation ? new Date(p.dateInstallation).toLocaleDateString() : '-'}</td>
                      <td><span className={`badge bg-${p.status === 'Neuf' ? 'success' : p.status === 'Usé' ? 'warning' : 'danger'}`}>{p.status}</span></td>
                      <td>{p.camion?.numeroImmatriculation || '-'}</td>
                      <td>
                        {editingId === p._id ? (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-success" onClick={() => saveEdit(p._id)}>Enregistrer</button>
                            <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Annuler</button>
                          </div>
                        ) : (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-warning" onClick={() => startEdit(p)}>Modifier</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>Supprimer</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
