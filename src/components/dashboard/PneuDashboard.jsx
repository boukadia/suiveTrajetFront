import React, { useState, useEffect } from "react";
import { fetchPneus, addPneu, updatePneu, deletePneu } from "../../api/pneuApi";

export default function PneuDashboard() {
  const token = localStorage.getItem("token");
  const [pneus, setPneus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPneu, setNewPneu] = useState({ numeroSerie: "", marque: "", dimension: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadPneus();
  }, [token]);

  const loadPneus = async () => {
    try {
      setLoading(true);
      const data = await fetchPneus(token);
      setPneus(data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newPneu.numeroSerie || !newPneu.marque || !newPneu.dimension) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    try {
      const data = await addPneu(newPneu, token);
      setPneus(prev => [...prev, data]);
      setNewPneu({ numeroSerie: "", marque: "", dimension: "" });
    } catch (err) {
      setError("Erreur lors de l'ajout");
    }
  };

  const startEdit = (pneu) => {
    setEditingId(pneu._id);
    setEditData({ numeroSerie: pneu.numeroSerie, marque: pneu.marque, dimension: pneu.dimension });
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
          <div className="row g-2">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Numéro Série" value={newPneu.numeroSerie} onChange={e => setNewPneu({...newPneu, numeroSerie:e.target.value})} />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Marque" value={newPneu.marque} onChange={e => setNewPneu({...newPneu, marque:e.target.value})} />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Dimension" value={newPneu.dimension} onChange={e => setNewPneu({...newPneu, dimension:e.target.value})} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={handleAdd}>Ajouter</button>
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
                  <th>Numéro Série</th>
                  <th>Marque</th>
                  <th>Dimension</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pneus.length === 0 ? (
                  <tr><td colSpan="4" className="text-center">Aucun pneu trouvé</td></tr>
                ) : (
                  pneus.map(p => (
                    <tr key={p._id}>
                      <td>{editingId === p._id ? <input type="text" className="form-control form-control-sm" value={editData.numeroSerie} onChange={e => setEditData({...editData, numeroSerie: e.target.value})} /> : p.numeroSerie}</td>
                      <td>{editingId === p._id ? <input type="text" className="form-control form-control-sm" value={editData.marque} onChange={e => setEditData({...editData, marque: e.target.value})} /> : p.marque}</td>
                      <td>{editingId === p._id ? <input type="text" className="form-control form-control-sm" value={editData.dimension} onChange={e => setEditData({...editData, dimension: e.target.value})} /> : p.dimension}</td>
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
