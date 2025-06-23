import { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import Alert from "./Alert";

export default function Transactions({ account, onAccountUpdate }) {
  const [list, setList] = useState([]);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  /* ---- helper ---- */
  const refreshTx = () =>
    get(`/transactions/${account.id}`)
      .then((arr) => setList(arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
      .catch((e) => setError(e.message));

  useEffect(() => {
    refreshTx();
  }, [account]);

  const move = async (type) => {
    if (!amount || Number(amount) <= 0) return setError("Importo non valido");
    try {
      await post(
        `/transactions/${account.id}/${type}` +
          `?amount=${amount}&description=${encodeURIComponent(desc)}`
      );
      setAmount("");
      setDesc("");
      refreshTx();
      onAccountUpdate(await get(`/accounts/${account.id}`));
    } catch (e) {
      setError(e.message);
    }
  };

  /* ---- format ---- */
  const fmtAmount = (x) => `${x < 0 ? "-" : "+"}€ ${Math.abs(Number(x)).toLocaleString("it-IT")}`;

  const fmtDate = (iso) =>
    new Date(iso.replace(/^(.*\.\d{3})\d+$/, "$1")).toLocaleString("it-IT", {
      dateStyle: "short",
      timeStyle: "short",
    });

  /* ---- render ---- */
  return (
    <div className="p-4 border rounded-xl shadow space-y-4 bg-white col-span-2 text-gray-800">
      <h2 className="text-xl font-bold">Movimenti – {account.iban}</h2>

      <Alert message={error} />

      {/* form accredito/debito */}
      <div className="flex flex-wrap gap-2">
        <input
          className="input w-28 text-white placeholder-gray-400"
          placeholder="€ importo"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="input flex-1 min-w-40 text-white placeholder-gray-400"
          placeholder="Descrizione"
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

      {/* intestazione colonne */}
      <div className="flex w-full font-semibold border-b pb-1 text-sm">
        <span className="flex-1">Descrizione</span>
        <span className="w-24 text-right">Importo</span>
        <span className="w-32 text-right">Data / ora</span>
      </div>

      {/* righe movimenti */}
      <div className="space-y-1 text-sm">
        {list.map((t) => (
          <div key={t.id} className="flex w-full border-b last:border-0 py-1">
            <span className="flex-1 truncate">{t.description || "–"}</span>
            <span
              className={`w-24 text-right font-medium ${
                Number(t.amount) < 0 ? "text-red-600" : "text-green-700"
              }`}>
              {fmtAmount(t.amount)}
            </span>
            <span className="w-32 text-right whitespace-nowrap">{fmtDate(t.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
