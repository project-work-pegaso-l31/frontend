import { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import Alert from "./Alert";

export default function Customers({ selected, onSelect }) {
  const [list, setList] = useState([]);
  const [full, setFull] = useState("");
  const [mail, setMail] = useState("");
  const [cf, setCf] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  /* ---- carica tutti i clienti ---- */
  const refresh = () =>
    get("/customers")
      .then(setList)
      .catch((e) => setError(e.message));

  /*  ✅ non restituisce nulla */
  useEffect(() => {
    refresh();
  }, []);

  /* ---- crea cliente ---- */
  const add = async () => {
    if (!full || !mail || !cf) return setError("Tutti i campi sono obbligatori");
    try {
      await post("/customers", { fullName: full, email: mail, fiscalCode: cf });
      setFull("");
      setMail("");
      setCf("");
      refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  /* ---- cerca CF ---- */
  const find = async () => {
    if (!search) return;
    try {
      const c = await get(`/customers/by-fiscalCode?cf=${encodeURIComponent(search)}`);
      onSelect(c);
    } catch {
      setError("Cliente non trovato");
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow space-y-4 bg-white">
      <h2 className="text-xl font-bold">Clienti</h2>

      <Alert message={error} />

      {/* form nuovo cliente */}
      <div className="space-y-2">
        <input
          className="input w-full"
          placeholder="Nome completo"
          value={full}
          onChange={(e) => setFull(e.target.value)}
        />
        <input
          className="input w-full"
          placeholder="Email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
        <input
          className="input w-full"
          placeholder="Codice fiscale"
          value={cf}
          onChange={(e) => setCf(e.target.value.toUpperCase())}
        />
        <button className="btn w-full" onClick={add}>
          + Cliente
        </button>
      </div>

      {/* ricerca CF */}
      <div className="flex gap-2 pt-2 border-t">
        <input
          className="input flex-1"
          placeholder="Cerca CF…"
          value={search}
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
        />
        <button className="btn" onClick={find}>
          🔍
        </button>
      </div>

      {/* lista */}
      <div className="space-y-1 pt-2">
        {list.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className={`p-2 rounded cursor-pointer ${
              selected && selected.id === c.id ? "bg-blue-700 text-white" : "bg-blue-100"
            }`}>
            {c.fullName}
          </div>
        ))}
      </div>
    </div>
  );
}
