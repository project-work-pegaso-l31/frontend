import { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import Alert from "./Alert";

export default function Accounts({ customer, selected, onSelect }) {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    if (customer) get(`/accounts/by-customer/${customer.id}`).then(setList);
  };

  /* nessuna Promise restituita */
  useEffect(() => {
    load();
  }, [customer]);

  /* sync saldo aggiornato */
  useEffect(() => {
    if (!selected) return;
    setList((prev) => prev.map((a) => (a.id === selected.id ? { ...selected } : a)));
  }, [selected]);

  const addAccount = async () => {
    try {
      setError("");
      await post("/accounts", { customerId: customer.id });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!customer) return null;

  return (
    <div className="p-4 border rounded-xl shadow space-y-3 bg-white text-gray-800 overflow-y-auto max-h-96">
      <h2 className="text-xl font-bold text-black">Conti di {customer.fullName}</h2>

      <Alert message={error} />

      {list.map((a) => (
        <div
          key={a.id}
          onClick={() => onSelect(a)}
          className={`p-4 rounded-lg cursor-pointer space-y-1
               ${
                 selected && selected.id === a.id
                   ? "bg-gray-900 text-green-400"
                   : "bg-gray-800 text-green-300"
               }`}>
          <div className="text-sm font-mono truncate" title={a.iban}>
            {a.iban}
          </div>
          <div className="text-xs">
            {a.balance < 0 ? "-" : ""}€ {Math.abs(a.balance).toLocaleString("it-IT")}
          </div>
        </div>
      ))}

      <button className="btn mt-2" onClick={addAccount}>
        + Conto
      </button>
    </div>
  );
}
