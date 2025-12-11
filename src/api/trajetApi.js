const BASE = import.meta.env.VITE_API;

export async function fetchTrajets(token) {
  const res = await fetch(`${BASE}/trajets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addTrajet(trajetData, token) {
  const res = await fetch(`${BASE}/trajets`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(trajetData),
  });
  return res.json();
}

export async function updateTrajet(id, trajetData, token) {
  const res = await fetch(`${BASE}/trajets/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(trajetData),
  });
  return res.json();
}

export async function deleteTrajet(id, token) {
  const res = await fetch(`${BASE}/trajets/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function changeStatutTrajet(id, statut, token) {
  const res = await fetch(`${BASE}/trajets/statut/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ statut }),
  });
  return res.json();
}
