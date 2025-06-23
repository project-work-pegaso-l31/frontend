import { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import Alert from "./Alert";

export default function Accounts({ customer, list, onLoaded, onSelect }) {
  const [error, setError] = useState("");

  /* fetch lista conti quando cambia cliente */
  useEffect(() => {
    if (!customer) return;
    setError("");
    get(`/accounts/by-customer/${customer.id}`)
      .then(onLoaded)
      .catch((e) => setError(e.message));
  }, [customer]);

  /* crea nuovo conto */
  const open = async () => {
    try {
      setError("");
      const acc = await post("/accounts", { customerId: customer.id });
      onLoaded([...list, acc]);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow space-y-4 bg-white">
      <h2 className="text-xl font-bold">Conti di {customer.fullName}</h2>

      <Alert message={error} />

      <ul className="space-y-1">
        {list.map((a) => (
          <li key={a.id}>
            <button className="text-green-700 hover:underline" onClick={() => onSelect(a)}>
              {a.iban} – € {Number(a.balance || 0).toLocaleString("it-IT")}
            </button>
          </li>
        ))}
      </ul>

      <button className="btn" onClick={open}>
        + Conto
      </button>
    </div>
  );
}
