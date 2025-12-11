const BASE = import.meta.env.VITE_API;

export async function fetchCamions(token) {
  const res = await fetch(`${BASE}/camions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addCamion(camionData, token) {
  const res = await fetch(`${BASE}/camions`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(camionData),
  });
  return res.json();
}

export async function updateCamion(id, camionData, token) {
  const res = await fetch(`${BASE}/camions/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(camionData),
  });
  return res.json();
}

export async function deleteCamion(id, token) {
  const res = await fetch(`${BASE}/camions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function changeStatusCamion(id, status, token) {
  const res = await fetch(`${BASE}/camions/status/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
}
