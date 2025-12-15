import React, { useState, useEffect, useContext } from "react";
import { fetchTrajets, addTrajet, updateTrajet, deleteTrajet, changeStatutTrajet } from "../../api/trajetApi";
import { fetchCamions } from "../../api/camionApi";
import { fetchRemorques } from "../../api/remorqueApi";
import { fetchUsers, updateUserStatus } from "../../api/userApi";
import { AuthContext } from "../../context/AuthContext";

export default function TrajetDashboard() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [trajets, setTrajets] = useState([]);
  const [camions, setCamions] = useState([]);
  const [remorques, setRemorques] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [chauffeur, setChauffeur] = useState("");
  const [camion, setCamion] = useState("");
  const [remorque, setRemorque] = useState("");
  const [pointDepart, setPointDepart] = useState("");
  const [pointArrivee, setPointArrivee] = useState("");
  const [dateDepart, setDateDepart] = useState("");
  const [dateArrivee, setDateArrivee] = useState("");
  const [kilometrageDepart, setKilometrageDepart] = useState("");
  const [kilometrageArrivee, setKilometrageArrivee] = useState("");
  const [volumeCarburant, setVolumeCarburant] = useState("");
  const [remarques, setRemarques] = useState("");
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
     
  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trajetsData, camionsData, remorquesData, chauffeursData] = await Promise.all([
        fetchTrajets(token),
        fetchCamions(token),
        fetchRemorques(token),
        fetchUsers(token)
      ]);
      setTrajets(Array.isArray(trajetsData) ? trajetsData : []);
      setCamions(Array.isArray(camionsData) ? camionsData : []);
      setRemorques(Array.isArray(remorquesData) ? remorquesData : []);
      setChauffeurs(Array.isArray(chauffeursData) ? chauffeursData : []);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
      setTrajets([]);
      setCamions([]);
      setRemorques([]);
      setChauffeurs([]);
    } finally {
      setLoading(false);
    }
  };
  console.log("traj",trajets);
  

  const handleAdd = async () => {
    if (!pointDepart || !pointArrivee || !camion || !chauffeur) {
      alert("Veuillez remplir les champs obligatoires (Chauffeur, Départ, Arrivée, Camion)");
      return;
    }
    try {
      // Préparer les données en excluant les champs vides
      const trajetData = {
        chauffeur,
        camion,
        pointDepart,
        pointArrivee,
      };
      
      // Ajouter les champs optionnels seulement s'ils sont remplis
      if (remorque) trajetData.remorque = remorque;
      if (dateDepart) trajetData.dateDepart = dateDepart;
      if (dateArrivee) trajetData.dateArrivee = dateArrivee;
      if (kilometrageDepart) trajetData.kilometrageDepart = Number(kilometrageDepart);
      if (kilometrageArrivee) trajetData.kilometrageArrivee = Number(kilometrageArrivee);
      if (volumeCarburant) trajetData.volumeCarburant = Number(volumeCarburant);
      if (remarques) trajetData.remarques = remarques;

      console.log("Données envoyées:", trajetData);
      
      const data = await addTrajet(trajetData, token);
      
      // Tenter d'activer le chauffeur (si l'API existe, sinon ignorer l'erreur)
      try {
        await updateUserStatus(chauffeur, "active", token);
      } catch (statusErr) {
        console.warn("Impossible de mettre à jour le statut du chauffeur:", statusErr);
      }
      
      setTrajets(prev => [...prev, data]);
      
      // Recharger les données pour mettre à jour la liste des chauffeurs
      await loadData();
      
      // Reset all fields
      setChauffeur("");
      setCamion("");
      setRemorque("");
      setPointDepart("");
      setPointArrivee("");
      setDateDepart("");
      setDateArrivee("");
      setKilometrageDepart("");
      setKilometrageArrivee("");
      setVolumeCarburant("");
      setRemarques("");
    } catch (err) {
      setError("Erreur lors de l'ajout");
      console.error(err);
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

  const handleStatutChange = async (id, newEtat) => {
    try {
      const updated = await changeStatutTrajet(id, newEtat, token);
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
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Chauffeur *</label>
              <select className="form-select" value={chauffeur} onChange={e => setChauffeur(e.target.value)}>
                <option value="">-- Sélectionner --</option>
                {chauffeurs.filter(c => c.status === 'inactive').map(c => <option key={c._id} value={c._id}>{c.nom} {c.prenom}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Camion *</label>
              <select className="form-select" value={camion} onChange={e => setCamion(e.target.value)}>
                <option value="">-- Sélectionner --</option>
                {camions.filter(c => c.status === 'Disponible').map(c => <option key={c._id} value={c._id}>{c.numeroImmatriculation}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Remorque</label>
              <select className="form-select" value={remorque} onChange={e => setRemorque(e.target.value)}>
                <option value="">-- Aucune --</option>
                {remorques.filter(r => r.status === 'Disponible').map(r => <option key={r._id} value={r._id}>{r.numeroImmatriculation}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Point Départ *</label>
              <input type="text" className="form-control" value={pointDepart} onChange={e => setPointDepart(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Point Arrivée *</label>
              <input type="text" className="form-control" value={pointArrivee} onChange={e => setPointArrivee(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date Départ</label>
              <input type="datetime-local" className="form-control" value={dateDepart} onChange={e => setDateDepart(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date Arrivée</label>
              <input type="datetime-local" className="form-control" value={dateArrivee} onChange={e => setDateArrivee(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Km Départ</label>
              <input type="number" className="form-control" value={kilometrageDepart} onChange={e => setKilometrageDepart(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Km Arrivée</label>
              <input type="number" className="form-control" value={kilometrageArrivee} onChange={e => setKilometrageArrivee(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Volume Carburant (L)</label>
              <input type="number" step="0.1" className="form-control" value={volumeCarburant} onChange={e => setVolumeCarburant(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Remarques</label>
              <textarea className="form-control" rows="2" value={remarques} onChange={e => setRemarques(e.target.value)}></textarea>
            </div>
            <div className="col-12">
              <button className="btn btn-primary" onClick={handleAdd}>Ajouter</button>
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
                  <th>Chauffeur</th>
                  <th>Camion</th>
                  <th>Départ</th>
                  <th>Arrivée</th>
                  <th>Date Départ</th>
                  <th>État</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trajets.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">Aucun trajet trouvé</td></tr>
                ) : (
                  trajets.map(t => (
                    <tr key={t._id}>
                      <td>{t.chauffeur?.nom || '-'}</td>
                      <td>{t.camion?.numeroImmatriculation || '-'}</td>
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
                        <select className="form-select form-select-sm" value={t.status} onChange={e => handleStatutChange(t._id, e.target.value)} disabled={editingId === t._id}>
                          <option value="A faire">A faire</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminer">Terminer</option>
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
