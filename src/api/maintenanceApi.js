const BASE = import.meta.env.VITE_API;

export async function fetchMaintenances(token) {
  const res = await fetch(`${BASE}/maintenances`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addMaintenance(maintenanceData, token) {
  const res = await fetch(`${BASE}/maintenances`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(maintenanceData),
  });
  return res.json();
}

export async function updateMaintenance(id, maintenanceData, token) {
  const res = await fetch(`${BASE}/maintenances/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(maintenanceData),
  });
  return res.json();
}

export async function deleteMaintenance(id, token) {
  const res = await fetch(`${BASE}/maintenances/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function changeStatutMaintenance(id, statut, token) {
  const res = await fetch(`${BASE}/maintenances/statut/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ statut }),
  });
  return res.json();
}
