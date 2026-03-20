const BASE = "https://rv-dashboard-v1.elevatics.site/api";

export async function fetchAppliances() {
  const r = await fetch(`${BASE}/appliances`);
  if (!r.ok) throw new Error("Failed to fetch appliances");
  return r.json();
}

export async function createAppliance(data) {
  const r = await fetch(`${BASE}/appliances`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function updateAppliance(id, data) {
  const r = await fetch(`${BASE}/appliances/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deleteAppliance(id) {
  const r = await fetch(`${BASE}/appliances/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function toggleAppliance(id, on) {
  const r = await fetch(`${BASE}/appliances/${id}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(on === undefined ? {} : { on }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function runSimulation(params) {
  const r = await fetch(`${BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function logWeather(data) {
  await fetch(`${BASE}/weather`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function fetchHistory(limit = 20) {
  const r = await fetch(`${BASE}/history?limit=${limit}`);
  if (!r.ok) throw new Error("Failed to fetch history");
  return r.json();
}

export async function fetchHealth() {
  const r = await fetch(`${BASE}/health`);
  return r.json();
}
