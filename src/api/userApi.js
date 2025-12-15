const BASE = import.meta.env.VITE_API;

export async function fetchUsers(token) {
  const res = await fetch(`${BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function updateUserStatus(id, token) {
  const res = await fetch(`${BASE}/users/status/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    // body: JSON.stringify({ status }),
  });
  return res.json();
}
