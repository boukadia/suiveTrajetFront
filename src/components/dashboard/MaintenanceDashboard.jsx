import React, { useState, useEffect } from "react";
import { fetchMaintenances, addMaintenance, updateMaintenance, deleteMaintenance, changeStatutMaintenance } from "../../api/maintenanceApi";
import { fetchCamions } from "../../api/camionApi";
import { fetchRemorques } from "../../api/remorqueApi";
import { fetchPneus } from "../../api/pneuApi";

export default function MaintenanceDashboard() {
  const token = localStorage.getItem("token");
  const [maintenances, setMaintenances] = useState([]);
  const [camions, setCamions] = useState([]);
  const [remorques, setRemorques] = useState([]);
  const [pneus, setPneus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [newMaintenance, setNewMaintenance] = useState({
    typeMaintenance: "",
    camion: "",
    remorque: "",
    pneu: "",
    dateMaintenance: "",
    description: ""
  });
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [maintenancesData, camionsData, remorquesData, pneusData] = await Promise.all([
        fetchMaintenances(token),
        fetchCamions(token),
        fetchRemorques(token),
        fetchPneus(token)
      ]);
      setMaintenances(maintenancesData);
      setCamions(camionsData);
      setRemorques(remorquesData);
      setPneus(pneusData);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newMaintenance.typeMaintenance || !newMaintenance.dateMaintenance) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }
    try {
      const data = await addMaintenance(newMaintenance, token);
      setMaintenances(prev => [...prev, data]);
      setNewMaintenance({
        typeMaintenance: "",
        camion: "",
        remorque: "",
        pneu: "",
        dateMaintenance: "",
        description: ""
      });
    } catch (err) {
      setError("Erreur lors de l'ajout");
      console.error(err);
    }
  };

  const startEdit = (maintenance) => {
    setEditingId(maintenance._id);
    setEditData({
      typeMaintenance: maintenance.typeMaintenance,
      dateMaintenance: maintenance.dateMaintenance ? new Date(maintenance.dateMaintenance).toISOString().slice(0, 10) : "",
      description: maintenance.description || ""
    });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await updateMaintenance(id, editData, token);
      setMaintenances(prev => prev.map(m => m._id === id ? updated : m));
      setEditingId(null);
    } catch (err) {
      setError("Erreur lors de la modification");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette maintenance ?")) return;
    try {
      await deleteMaintenance(id, token);
      setMaintenances(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    }
  };

  const handleStatutChange = async (id, newStatut) => {
    try {
      const updated = await changeStatutMaintenance(id, newStatut, token);
      setMaintenances(prev => prev.map(m => m._id === id ? updated : m));
    } catch (err) {
      setError("Erreur lors du changement de statut");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-4">Chargement...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gestion des Maintenances</h3>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Formulaire d'ajout */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Ajouter une maintenance</h5>
          <div className="row g-2">
            <div className="col-md-3">
              <select 
                className="form-select" 
                value={newMaintenance.typeMaintenance}
                onChange={e => setNewMaintenance({...newMaintenance, typeMaintenance: e.target.value})}
              >
                <option value="">Type de maintenance *</option>
                <option value="Révision">Révision</option>
                <option value="Réparation">Réparation</option>
                <option value="Changement pneu">Changement pneu</option>
                <option value="Vidange">Vidange</option>
                <option value="Contrôle technique">Contrôle technique</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <div className="col-md-2">
              <select 
                className="form-select" 
                value={newMaintenance.camion}
                onChange={e => setNewMaintenance({...newMaintenance, camion: e.target.value})}
              >
                <option value="">Camion (optionnel)</option>
                {camions.map(c => (
                  <option key={c._id} value={c._id}>{c.numeroImmatriculation}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select 
                className="form-select" 
                value={newMaintenance.remorque}
                onChange={e => setNewMaintenance({...newMaintenance, remorque: e.target.value})}
              >
                <option value="">Remorque (optionnel)</option>
                {remorques.map(r => (
                  <option key={r._id} value={r._id}>{r.matricule}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select 
                className="form-select" 
                value={newMaintenance.pneu}
                onChange={e => setNewMaintenance({...newMaintenance, pneu: e.target.value})}
              >
                <option value="">Pneu (optionnel)</option>
                {pneus.map(p => (
                  <option key={p._id} value={p._id}>{p.numeroSerie}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <input 
                type="date" 
                className="form-control" 
                value={newMaintenance.dateMaintenance}
                onChange={e => setNewMaintenance({...newMaintenance, dateMaintenance: e.target.value})}
              />
            </div>

            <div className="col-md-1">
              <button className="btn btn-primary w-100" onClick={handleAdd}>
                Ajouter
              </button>
            </div>
          </div>
          
          <div className="row g-2 mt-2">
            <div className="col-md-12">
              <textarea 
                className="form-control" 
                placeholder="Description (optionnel)"
                rows="2"
                value={newMaintenance.description}
                onChange={e => setNewMaintenance({...newMaintenance, description: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des maintenances */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Liste des maintenances ({maintenances.length})</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Type</th>
                  <th>Camion</th>
                  <th>Remorque</th>
                  <th>Pneu</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenances.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">Aucune maintenance trouvée</td>
                  </tr>
                ) : (
                  maintenances.map(m => (
                    <tr key={m._id}>
                      <td>
                        {editingId === m._id ? (
                          <select 
                            className="form-select form-select-sm" 
                            value={editData.typeMaintenance}
                            onChange={e => setEditData({...editData, typeMaintenance: e.target.value})}
                          >
                            <option value="Révision">Révision</option>
                            <option value="Réparation">Réparation</option>
                            <option value="Changement pneu">Changement pneu</option>
                            <option value="Vidange">Vidange</option>
                            <option value="Contrôle technique">Contrôle technique</option>
                            <option value="Autre">Autre</option>
                          </select>
                        ) : (
                          m.typeMaintenance
                        )}
                      </td>
                      <td>{m.camion?.numeroImmatriculation || "-"}</td>
                      <td>{m.remorque?.matricule || "-"}</td>
                      <td>{m.pneu?.numeroSerie || "-"}</td>
                      <td>
                        {editingId === m._id ? (
                          <input 
                            type="date" 
                            className="form-control form-control-sm" 
                            value={editData.dateMaintenance}
                            onChange={e => setEditData({...editData, dateMaintenance: e.target.value})}
                          />
                        ) : (
                          new Date(m.dateMaintenance).toLocaleDateString()
                        )}
                      </td>
                      <td>
                        {editingId === m._id ? (
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editData.description}
                            onChange={e => setEditData({...editData, description: e.target.value})}
                          />
                        ) : (
                          m.description || "-"
                        )}
                      </td>
                      <td>
                        <select 
                          className="form-select form-select-sm"
                          value={m.statut}
                          onChange={e => handleStatutChange(m._id, e.target.value)}
                          disabled={editingId === m._id}
                        >
                          <option value="En attente">En attente</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminé">Terminé</option>
                        </select>
                      </td>
                      <td>
                        {editingId === m._id ? (
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-success" 
                              onClick={() => saveEdit(m._id)}
                            >
                              Enregistrer
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              onClick={() => setEditingId(null)}
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-warning" 
                              onClick={() => startEdit(m)}
                            >
                              Modifier
                            </button>
                            <button 
                              className="btn btn-danger" 
                              onClick={() => handleDelete(m._id)}
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
