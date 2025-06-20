import { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import Alert from "./Alert";

export default function Customers({ onSelect }) {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    fiscalCode: "",
  });

  // carica i clienti all'avvio
  useEffect(() => {
    get("/customers")
      .then(setList)
      .catch((e) => setError(e.message));
  }, []);

  const create = async () => {
    if (!form.fullName || !form.email || !form.fiscalCode) {
      setError("Compila tutti i campi");
      return;
    }
    try {
      setError("");
      const created = await post("/customers", form);
      setList((prev) => [...prev, created]);
      setForm({ fullName: "", email: "", fiscalCode: "" });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow space-y-4 bg-white">
      <h2 className="text-xl font-bold">Clienti</h2>

      <Alert message={error} />

      <ul className="space-y-1">
        {list.map((c) => (
          <li key={c.id}>
            <button className="text-blue-600 hover:underline" onClick={() => onSelect(c)}>
              {c.fullName}
            </button>
          </li>
        ))}
      </ul>

      <div className="space-y-2 text-sm">
        <input
          className="input"
          placeholder="Nome"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input"
          placeholder="Codice fiscale"
          value={form.fiscalCode}
          onChange={(e) => setForm({ ...form, fiscalCode: e.target.value })}
        />
        <button className="btn" onClick={create}>
          + Cliente
        </button>
      </div>
    </div>
  );
}
