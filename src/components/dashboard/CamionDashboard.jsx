import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchCamions, addCamion, updateCamion, deleteCamion, changeStatusCamion } from "../../api/camionApi";

export default function CamionDashboard() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [camions, setCamions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCamion, setNewCamion] = useState({ 
    numeroImmatriculation: "", 
    marque: "", 
    modele: "" 
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  
  useEffect(() => {
    loadCamions();
  }, [token]);

  const loadCamions = async () => {
    try {
      setLoading(true);
      const data = await fetchCamions(token);
      setCamions(data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des camions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleAdd = async () => {
    if (!newCamion.numeroImmatriculation || !newCamion.marque || !newCamion.modele) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      const data = await addCamion(newCamion, token);
      setCamions(prev => [...prev, data]);
      setNewCamion({ numeroImmatriculation: "", marque: "", modele: "" });
      setError("");
    } catch (err) {
      setError("Erreur lors de l'ajout");
      console.error(err);
    }
  };

 
  const startEdit = (camion) => {
    setEditingId(camion._id);
    setEditData({
      numeroImmatriculation: camion.numeroImmatriculation,
      marque: camion.marque,
      modele: camion.modele
    });
  };

  
  const saveEdit = async (id) => {
    try {
      const updated = await updateCamion(id, editData, token);
      setCamions(prev => prev.map(c => c._id === id ? updated : c));
      setEditingId(null);
      setError("");
    } catch (err) {
      setError("Erreur lors de la modification");
      console.error(err);
    }
  };

  
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  
  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce camion ?")) return;
    
    try {
      await deleteCamion(id, token);
      setCamions(prev => prev.filter(c => c._id !== id));
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    }
  };

  
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await changeStatusCamion(id, newStatus, token);
      setCamions(prev => prev.map(c => c._id === id ? updated : c));
      setError("");
    } catch (err) {
      setError("Erreur lors du changement de statut");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-4">Chargement...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gestion des Camions</h3>
      
      {error && <div className="alert alert-danger">{error}</div>}

      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Ajouter un nouveau camion</h5>
          <div className="row g-2">
            <div className="col-md-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Numéro Immatriculation" 
                value={newCamion.numeroImmatriculation} 
                onChange={e => setNewCamion({...newCamion, numeroImmatriculation: e.target.value})} 
              />
            </div>
            <div className="col-md-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Marque" 
                value={newCamion.marque} 
                onChange={e => setNewCamion({...newCamion, marque: e.target.value})} 
              />
            </div>
            <div className="col-md-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Modèle" 
                value={newCamion.modele} 
                onChange={e => setNewCamion({...newCamion, modele: e.target.value})} 
              />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={handleAdd}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Liste des camions ({camions.length})</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Immatriculation</th>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {camions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">Aucun camion trouvé</td>
                  </tr>
                ) : (
                  camions.map(c => (
                    <tr key={c._id}>
                      <td>
                        {editingId === c._id ? (
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editData.numeroImmatriculation}
                            onChange={e => setEditData({...editData, numeroImmatriculation: e.target.value})}
                          />
                        ) : (
                          c.numeroImmatriculation
                        )}
                      </td>
                      <td>
                        {editingId === c._id ? (
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editData.marque}
                            onChange={e => setEditData({...editData, marque: e.target.value})}
                          />
                        ) : (
                          c.marque
                        )}
                      </td>
                      <td>
                        {editingId === c._id ? (
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editData.modele}
                            onChange={e => setEditData({...editData, modele: e.target.value})}
                          />
                        ) : (
                          c.modele
                        )}
                      </td>
                      <td>
                        <select 
                          className="form-select form-select-sm"
                          value={c.status}
                          onChange={e => handleStatusChange(c._id, e.target.value)}
                          disabled={editingId === c._id}
                        >
                          <option value="Disponible">Disponible</option>
                          <option value="En route">En route</option>
                          <option value="En maintenance">En maintenance</option>
                        </select>
                      </td>
                      <td>
                        {editingId === c._id ? (
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-success" 
                              onClick={() => saveEdit(c._id)}
                            >
                              Enregistrer
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              onClick={cancelEdit}
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-warning" 
                              onClick={() => startEdit(c)}
                            >
                              Modifier
                            </button>
                            <button 
                              className="btn btn-danger" 
                              onClick={() => handleDelete(c._id)}
                            >
                              Supprimer
                            </button>
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
