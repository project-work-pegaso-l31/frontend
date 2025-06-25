const BASE = "http://localhost:8080/api";

async function http(method, url, body) {
  const res = await fetch(BASE + url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return;
  return await res.json();
}

export const get = (u) => http("GET", u);
export const post = (u, b) => http("POST", u, b);
export const put = (u, b) => http("PUT", u, b); // per anagrafica
