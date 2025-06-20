import { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import Alert from "./Alert";

export default function Transactions({ account }) {
  const [list, setList] = useState([]);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  const refresh = () =>
    get(`/transactions/${account.id}`)
      .then(setList)
      .catch((e) => setError(e.message));

  useEffect(refresh, [account]);

  const move = async (type) => {
    if (!amount || Number(amount) <= 0) {
      setError("Importo non valido");
      return;
    }
    try {
      setError("");
      await post(
        `/transactions/${account.id}/${type}?amount=${amount}&description=${encodeURIComponent(
          desc
        )}`
      );
      setAmount("");
      setDesc("");
      refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow space-y-4 bg-white col-span-2">
      <h2 className="text-xl font-bold">Movimenti – {account.iban}</h2>

      <Alert message={error} />

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          className="input sm:w-24"
          placeholder="€ importo"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="input flex-1"
          placeholder="Descrizione (facoltativa)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className="btn" onClick={() => move("credit")}>
          + Accredito
        </button>
        <button className="btn" onClick={() => move("debit")}>
          – Addebito
        </button>
      </div>

      <ul className="mt-4 space-y-1 text-sm">
        {list.map((t) => (
          <li key={t.id}>
            {t.type} {t.amount} € – {t.description ?? ""} ({t.createdAt})
          </li>
        ))}
      </ul>
    </div>
  );
}
