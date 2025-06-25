const BASE = "http://localhost:8080/api";

/**
 * Effettua la chiamata HTTP e, se la risposta non è OK,
 * estrae un messaggio parlante sia da JSON {error:"…"}
 * sia da testo puro.
 */
async function http(method, url, body) {
  const res = await fetch(BASE + url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = "Errore inaspettato";
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      try {
        const data = await res.json();
        message = data.error || message;
      } catch {
        /* JSON non parse-able → ignoro */
      }
    } else {
      message = await res.text();
    }
    throw new Error(message);
  }

  if (res.status === 204) return; // nessun contenuto
  return await res.json(); // risposta OK con JSON
}

export const get = (u) => http("GET", u);
export const post = (u, b) => http("POST", u, b);
export const put = (u, b) => http("PUT", u, b);
