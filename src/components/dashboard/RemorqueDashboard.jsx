import React, { useState, useEffect } from "react";
import { fetchRemorques, addRemorque, updateRemorque, deleteRemorque, changeStatusRemorque } from "../../api/remorqueApi";

export default function RemorqueDashboard() {
  const token = localStorage.getItem("token");
  const [remorques, setRemorques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newRemorque, setNewRemorque] = useState({ matricule: "", marque: "", modele: "" });
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
    if (!newRemorque.matricule || !newRemorque.marque || !newRemorque.modele) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    try {
      const data = await addRemorque(newRemorque, token);
      setRemorques(prev => [...prev, data]);
      setNewRemorque({ matricule: "", marque: "", modele: "" });
    } catch (err) {
      setError("Erreur lors de l'ajout");
    }
  };

  const startEdit = (remorque) => {
    setEditingId(remorque._id);
    setEditData({ matricule: remorque.matricule, marque: remorque.marque, modele: remorque.modele });
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
          <div className="row g-2">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Matricule" value={newRemorque.matricule} onChange={e => setNewRemorque({...newRemorque, matricule:e.target.value})} />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Marque" value={newRemorque.marque} onChange={e => setNewRemorque({...newRemorque, marque:e.target.value})} />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Modèle" value={newRemorque.modele} onChange={e => setNewRemorque({...newRemorque, modele:e.target.value})} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={handleAdd}>Ajouter</button>
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
                  <th>Matricule</th>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {remorques.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">Aucune remorque trouvée</td></tr>
                ) : (
                  remorques.map(r => (
                    <tr key={r._id}>
                      <td>{editingId === r._id ? <input type="text" className="form-control form-control-sm" value={editData.matricule} onChange={e => setEditData({...editData, matricule: e.target.value})} /> : r.matricule}</td>
                      <td>{editingId === r._id ? <input type="text" className="form-control form-control-sm" value={editData.marque} onChange={e => setEditData({...editData, marque: e.target.value})} /> : r.marque}</td>
                      <td>{editingId === r._id ? <input type="text" className="form-control form-control-sm" value={editData.modele} onChange={e => setEditData({...editData, modele: e.target.value})} /> : r.modele}</td>
                      <td>
                        <select className="form-select form-select-sm" value={r.status} onChange={e => handleStatusChange(r._id, e.target.value)} disabled={editingId === r._id}>
                          <option value="Disponible">Disponible</option>
                          <option value="En route">En route</option>
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
