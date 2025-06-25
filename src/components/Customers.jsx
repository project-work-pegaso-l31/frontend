import { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import Alert from "./Alert";

/* CF “base”: 16 caratteri alfanumerici */
const CF_REGEX = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/i;

export default function Customers({ selected, onSelect }) {
  const [list, setList] = useState([]);
  const [full, setFull] = useState("");
  const [mail, setMail] = useState("");
  const [cf, setCf] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  /* ---- carica tutti ---- */
  const refresh = () =>
    get("/customers")
      .then(setList)
      .catch((e) => setError(e.message));

  useEffect(() => {
    refresh();
  }, []);

  /* ---- nuovo cliente ---- */
  const add = async () => {
    if (!full || !mail || !cf) return setError("Tutti i campi sono obbligatori");
    try {
      await post("/customers", {
        fullName: full,
        email: mail,
        fiscalCode: cf,
      });
      setFull("");
      setMail("");
      setCf("");
      refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  /* ---- ricerca CF ---- */
  const find = async () => {
    const q = search.trim().toUpperCase();
    if (!CF_REGEX.test(q)) return setError("Inserire un codice fiscale completo o valido");
    try {
      /* ↙️ path-param, NON query-param */
      const c = await get(`/customers/by-fiscalCode/${q}`);
      onSelect(c);
      setError("");
    } catch {
      setError("Cliente non trovato");
    }
  };

  /* ------- render ------- */
  return (
    <div className="p-4 border rounded-xl shadow space-y-4 bg-white text-gray-800">
      <h2 className="text-xl font-bold">Lista clienti</h2>

      <Alert message={error} />

      {/* form nuovo cliente */}
      <div className="space-y-2">
        <h3 className="font-semibold">Inserimento nuovo cliente</h3>

        <input
          className="input w-full text-white placeholder-gray-300"
          placeholder="Nome completo"
          value={full}
          onChange={(e) => setFull(e.target.value)}
        />
        <input
          className="input w-full text-white placeholder-gray-300"
          placeholder="Email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
        <input
          className="input w-full text-white placeholder-gray-300"
          placeholder="Codice fiscale"
          value={cf}
          onChange={(e) => setCf(e.target.value.toUpperCase())}
        />

        <button className="btn w-full" onClick={add}>
          + Cliente
        </button>
      </div>

      {/* ricerca CF */}
      <div className="pt-4 border-t space-y-2">
        <h3 className="font-semibold">Ricerca cliente per CF</h3>

        <div className="flex gap-2">
          <input
            className="input flex-1 text-white placeholder-gray-300"
            placeholder="Cerca CF…"
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && find()}
          />
          <button className="btn" onClick={find}>
            🔍
          </button>
        </div>
      </div>

      {/* lista scrollabile */}
      <div className="space-y-1 pt-2 overflow-y-auto max-h-96 pr-1">
        {list.map((c) => (
          <div
            key={c.id}
            className={`flex items-center justify-between p-2 rounded ${
              selected && selected.id === c.id ? "bg-blue-200" : "bg-blue-50"
            }`}>
            <span className="text-black truncate">{c.fullName}</span>

            <button
              title="Dettagli"
              onClick={() => onSelect(c)}
              className="w-6 h-6 flex items-center justify-center rounded-full
                         bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">
              i
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
