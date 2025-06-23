const api = "http://localhost:8080/api";

/* ------------------------------------------------------------------ */
/*  Wrapper fetch → JSON + gestione errori parlanti                   */
/* ------------------------------------------------------------------ */
async function http(method, url, body) {
  const res = await fetch(api + url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  /* ---- OK ---- */
  if (res.ok) return res.status === 204 ? null : res.json();

  /* ---- ERRORE: estraggo messaggio leggibile ---- */
  let msg = res.statusText; // fallback generale ("Bad Request", …)

  try {
    const data = await res.json();

    /* possibili strutture di risposta                                          
       { error:"Codice fiscale non valido" }                       (GlobalHandler)
       { message:"Email non valida", status:400, ... }             (Spring MVC) 
       { errors:[{defaultMessage:"Campo obbligatorio"}, ...] }     (BeanValidation)
    */
    if (data.error) msg = data.error;
    else if (data.message && data.message !== "Bad Request") msg = data.message;
    else if (Array.isArray(data.errors) && data.errors.length) msg = data.errors[0].defaultMessage;
    else msg = JSON.stringify(data);
  } catch (_) {
    /* risposta non-JSON → plain text */
    msg = await res.text();
  }

  throw new Error(msg || "Errore sconosciuto");
}

/* ------------------------------------------------------------------ */
/*  API helpers                                                       */
/* ------------------------------------------------------------------ */
export const get = (url) => http("GET", url);
export const post = (url, body) => http("POST", url, body);
