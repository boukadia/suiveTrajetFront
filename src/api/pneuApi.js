const BASE = import.meta.env.VITE_API;

export async function fetchPneus(token) {
  const res = await fetch(`${BASE}/pneus`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addPneu(pneuData, token) {
  const res = await fetch(`${BASE}/pneus`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(pneuData),
  });
  return res.json();
}

export async function updatePneu(id, pneuData, token) {
  const res = await fetch(`${BASE}/pneus/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(pneuData),
  });
  return res.json();
}

export async function deletePneu(id, token) {
  const res = await fetch(`${BASE}/pneus/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
