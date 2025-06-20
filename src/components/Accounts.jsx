import { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import Alert from "./Alert";

export default function Accounts({ customer, onSelect }) {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  /* ──────────────────────────────────────────
     Carica / ricarica conti quando cambia cliente
  ────────────────────────────────────────────*/
  useEffect(() => {
    if (!customer) return;
    setError("");
    get(`/accounts/by-customer/${customer.id}`)
      .then(setList)
      .catch((e) => setError(e.message));
  }, [customer]);

  /* ──────────────────────────────────────────
     Richiede al backend di aprire un nuovo conto
     (IBAN generato automaticamente)
  ────────────────────────────────────────────*/
  const open = async () => {
    try {
      setError("");
      const acc = await post("/accounts", { customerId: customer.id });
      setList((prev) => [...prev, acc]);
    } catch (e) {
      setError(e.message);
    }
  };

  /* ──────────────────────────────────────────
     Render
  ────────────────────────────────────────────*/
  return (
    <div className="p-4 border rounded-xl shadow space-y-4 bg-white">
      <h2 className="text-xl font-bold">Conti di {customer.fullName}</h2>

      <Alert message={error} />

      <ul className="space-y-1">
        {list.map((a) => (
          <li key={a.id}>
            <button className="text-green-700 hover:underline" onClick={() => onSelect(a)}>
              {a.iban} – € {a.balance.toLocaleString("it-IT")}
            </button>
          </li>
        ))}
      </ul>

      {/* NIENTE input IBAN – solo il bottone */}
      <button className="btn" onClick={open}>
        + Conto
      </button>
    </div>
  );
}
