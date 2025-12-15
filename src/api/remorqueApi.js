const BASE = import.meta.env.VITE_API;

export async function fetchRemorques(token) {
  const res = await fetch(`${BASE}/remorques`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addRemorque(remorqueData, token) {
  const res = await fetch(`${BASE}/remorques`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(remorqueData),
  });
  return res.json();
}

export async function updateRemorque(id, remorqueData, token) {
  const res = await fetch(`${BASE}/remorques/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(remorqueData),
  });
  return res.json();
}

export async function deleteRemorque(id, token) {
  const res = await fetch(`${BASE}/remorques/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function changeStatusRemorque(id, status, token) {
  console.log({base: BASE, id, status});
  
  const res = await fetch(`${BASE}/remorques/status/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
}
