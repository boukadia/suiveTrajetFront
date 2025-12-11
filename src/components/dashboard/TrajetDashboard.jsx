import React, { useState, useEffect } from "react";
import { fetchTrajets, addTrajet, updateTrajet, deleteTrajet, changeStatutTrajet } from "../../api/trajetApi";

export default function TrajetDashboard() {
  const token = localStorage.getItem("token");
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTrajet, setNewTrajet] = useState({ pointDepart: "", pointArrivee: "", dateDepart: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadTrajets();
  }, [token]);

  const loadTrajets = async () => {
    try {
      setLoading(true);
      const data = await fetchTrajets(token);
      setTrajets(data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newTrajet.pointDepart || !newTrajet.pointArrivee) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    try {
      const data = await addTrajet(newTrajet, token);
      setTrajets(prev => [...prev, data]);
      setNewTrajet({ pointDepart: "", pointArrivee: "", dateDepart: "" });
    } catch (err) {
      setError("Erreur lors de l'ajout");
    }
  };

  const startEdit = (trajet) => {
    setEditingId(trajet._id);
    setEditData({ 
      pointDepart: trajet.pointDepart, 
      pointArrivee: trajet.pointArrivee,
      dateDepart: trajet.dateDepart ? new Date(trajet.dateDepart).toISOString().slice(0, 16) : ""
    });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await updateTrajet(id, editData, token);
      setTrajets(prev => prev.map(t => t._id === id ? updated : t));
      setEditingId(null);
    } catch (err) {
      setError("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr ?")) return;
    try {
      await deleteTrajet(id, token);
      setTrajets(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleStatutChange = async (id, newStatut) => {
    try {
      const updated = await changeStatutTrajet(id, newStatut, token);
      setTrajets(prev => prev.map(t => t._id === id ? updated : t));
    } catch (err) {
      setError("Erreur lors du changement de statut");
    }
  };

  if (loading) return <div className="text-center">Chargement...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gestion des Trajets</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Ajouter un trajet</h5>
          <div className="row g-2">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Point Départ" value={newTrajet.pointDepart} onChange={e => setNewTrajet({...newTrajet, pointDepart:e.target.value})} />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Point Arrivée" value={newTrajet.pointArrivee} onChange={e => setNewTrajet({...newTrajet, pointArrivee:e.target.value})} />
            </div>
            <div className="col-md-3">
              <input type="datetime-local" className="form-control" value={newTrajet.dateDepart} onChange={e => setNewTrajet({...newTrajet, dateDepart:e.target.value})} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={handleAdd}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Liste des trajets ({trajets.length})</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Départ</th>
                  <th>Arrivée</th>
                  <th>Date Départ</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trajets.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">Aucun trajet trouvé</td></tr>
                ) : (
                  trajets.map(t => (
                    <tr key={t._id}>
                      <td>{editingId === t._id ? <input type="text" className="form-control form-control-sm" value={editData.pointDepart} onChange={e => setEditData({...editData, pointDepart: e.target.value})} /> : t.pointDepart}</td>
                      <td>{editingId === t._id ? <input type="text" className="form-control form-control-sm" value={editData.pointArrivee} onChange={e => setEditData({...editData, pointArrivee: e.target.value})} /> : t.pointArrivee}</td>
                      <td>
                        {editingId === t._id ? (
                          <input type="datetime-local" className="form-control form-control-sm" value={editData.dateDepart} onChange={e => setEditData({...editData, dateDepart: e.target.value})} />
                        ) : (
                          t.dateDepart ? new Date(t.dateDepart).toLocaleString() : "Non définie"
                        )}
                      </td>
                      <td>
                        <select className="form-select form-select-sm" value={t.statut} onChange={e => handleStatutChange(t._id, e.target.value)} disabled={editingId === t._id}>
                          <option value="En attente">En attente</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminé">Terminé</option>
                          <option value="Annulé">Annulé</option>
                        </select>
                      </td>
                      <td>
                        {editingId === t._id ? (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-success" onClick={() => saveEdit(t._id)}>Enregistrer</button>
                            <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Annuler</button>
                          </div>
                        ) : (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-warning" onClick={() => startEdit(t)}>Modifier</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(t._id)}>Supprimer</button>
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
