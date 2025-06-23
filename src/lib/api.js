const BASE = import.meta.env.VITE_API || "http://localhost:8080/api";

async function http(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    // Proviamo a leggere JSON {error: "..."} altrimenti testo semplice
    let msg = "";
    try {
      const data = await res.clone().json();
      msg = data.error ?? JSON.stringify(data);
    } catch {
      msg = await res.text();
    }
    throw new Error(msg || res.statusText);
  }
  // 204? → null, altrimenti JSON
  return res.status === 204 ? null : res.json();
}

export const get = (p) => http("GET", p);
export const post = (p, b) => http("POST", p, b);
