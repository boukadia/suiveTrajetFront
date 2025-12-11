const BASE = import.meta.env.VITE_API || "http://localhost:5000/api";

export async function loginApi(email, motDePasse) {
  const res = await fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, motDePasse }),
  });
  if (!res.ok) throw new Error("Email ou mot de passe invalide");
  return res.json(); // { user, token }
}

export async function registerApi(formData) {
  const res = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erreur inscription");
  }
  return res.json();
}

export async function validateApi(token) {
  const res = await fetch(`${BASE}/auth/validate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
