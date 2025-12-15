import React, { useState, useEffect } from "react";
import { fetchRemorques, addRemorque, updateRemorque, deleteRemorque, changeStatusRemorque } from "../../api/remorqueApi";

export default function RemorqueDashboard() {
  const token = localStorage.getItem("token");
  const [remorques, setRemorques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newRemorque, setNewRemorque] = useState({ numeroImmatriculation: "", type: "", capacite: "", kilometrage: 0, dernierControleKm: "", dernierControleDate: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadRemorques();
  }, [token]);

  const loadRemorques = async () => {
    try {
      setLoading(true);
      const data = await fetchRemorques(token);
      setRemorques(data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newRemorque.numeroImmatriculation || !newRemorque.type) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }
    try {
      const data = await addRemorque(newRemorque, token);
      setRemorques(prev => [...prev, data]);
      setNewRemorque({ numeroImmatriculation: "", type: "", capacite: "", kilometrage: 0, dernierControleKm: "", dernierControleDate: "" });
    } catch (err) {
      setError("Erreur lors de l'ajout");
    }
  };

  const startEdit = (remorque) => {
    setEditingId(remorque._id);
    setEditData({ 
      numeroImmatriculation: remorque.numeroImmatriculation, 
      type: remorque.type, 
      capacite: remorque.capacite || "",
      kilometrage: remorque.kilometrage || 0,
      dernierControleKm: remorque.dernierControleKm || "",
      dernierControleDate: remorque.dernierControleDate ? new Date(remorque.dernierControleDate).toISOString().slice(0, 10) : ""
    });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await updateRemorque(id, editData, token);
      setRemorques(prev => prev.map(r => r._id === id ? updated : r));
      setEditingId(null);
    } catch (err) {
      setError("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr ?")) return;
    try {
      await deleteRemorque(id, token);
      setRemorques(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      
      const updated = await changeStatusRemorque(id, newStatus, token);
      setRemorques(prev => prev.map(r => r._id === id ? updated : r));
    } catch (err) {
      setError("Erreur lors du changement de statut");
    }
  };

  if (loading) return <div className="text-center">Chargement...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gestion des Remorques</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Ajouter une remorque</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Numéro Immatriculation *</label>
              <input type="text" className="form-control" value={newRemorque.numeroImmatriculation} onChange={e => setNewRemorque({...newRemorque, numeroImmatriculation:e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Type *</label>
              <input type="text" className="form-control" value={newRemorque.type} onChange={e => setNewRemorque({...newRemorque, type:e.target.value})} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Capacité (T)</label>
              <input type="number" className="form-control" value={newRemorque.capacite} onChange={e => setNewRemorque({...newRemorque, capacite:e.target.value})} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Kilométrage</label>
              <input type="number" className="form-control" value={newRemorque.kilometrage} onChange={e => setNewRemorque({...newRemorque, kilometrage:Number(e.target.value)})} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Dernier Contrôle (Km)</label>
              <input type="number" className="form-control" value={newRemorque.dernierControleKm} onChange={e => setNewRemorque({...newRemorque, dernierControleKm:e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date Contrôle</label>
              <input type="date" className="form-control" value={newRemorque.dernierControleDate} onChange={e => setNewRemorque({...newRemorque, dernierControleDate:e.target.value})} />
            </div>
            <div className="col-12">
              <button className="btn btn-primary" onClick={handleAdd}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Liste des remorques ({remorques.length})</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Immatriculation</th>
                  <th>Type</th>
                  <th>Capacité</th>
                  <th>Kilométrage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {remorques.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">Aucune remorque trouvée</td></tr>
                ) : (
                  remorques.map(r => (
                    <tr key={r._id}>
                      <td>{editingId === r._id ? <input type="text" className="form-control form-control-sm" value={editData.numeroImmatriculation} onChange={e => setEditData({...editData, numeroImmatriculation: e.target.value})} /> : r.numeroImmatriculation}</td>
                      <td>{editingId === r._id ? <input type="text" className="form-control form-control-sm" value={editData.type} onChange={e => setEditData({...editData, type: e.target.value})} /> : r.type}</td>
                      <td>{editingId === r._id ? <input type="number" className="form-control form-control-sm" value={editData.capacite} onChange={e => setEditData({...editData, capacite: e.target.value})} /> : (r.capacite || '-')}</td>
                      <td>{editingId === r._id ? <input type="number" className="form-control form-control-sm" value={editData.kilometrage} onChange={e => setEditData({...editData, kilometrage: Number(e.target.value)})} /> : (r.kilometrage || 0)}</td>
                      <td>
                        <select className="form-select form-select-sm" value={r.status} onChange={e => handleStatusChange(r._id, e.target.value)} disabled={editingId === r._id}>
                          <option value="Disponible">Disponible</option>
                          <option value="Hors Service">Hors Service</option>
                          <option value="En trajet">En trajet</option>
                          <option value="En maintenance">En maintenance</option>
                        </select>
                      </td>
                      <td>
                        {editingId === r._id ? (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-success" onClick={() => saveEdit(r._id)}>Enregistrer</button>
                            <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Annuler</button>
                          </div>
                        ) : (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-warning" onClick={() => startEdit(r)}>Modifier</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(r._id)}>Supprimer</button>
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
