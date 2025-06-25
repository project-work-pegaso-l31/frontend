/* src/components/CustomerDetails.jsx */
import { useState } from "react";
import { put } from "../lib/api";
import Alert from "./Alert";

/* regex ri-uso dai form di creazione */
const CF_REGEX = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/i;
const MAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function CustomerDetails({ customer, onUpdate }) {
  /* stato modale */
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(customer.fullName);
  const [mail, setMail] = useState(customer.email);
  const [cf, setCf] = useState(customer.fiscalCode);
  const [err, setErr] = useState("");

  const reset = () => {
    setFull(customer.fullName);
    setMail(customer.email);
    setCf(customer.fiscalCode);
    setErr("");
  };

  const save = async () => {
    if (!MAIL_REGEX.test(mail)) return setErr("Email non valida");
    if (!CF_REGEX.test(cf)) return setErr("Codice fiscale non valido");
    try {
      const upd = await put(`/customers/${customer.id}`, {
        fullName: full,
        email: mail,
        fiscalCode: cf,
      });
      onUpdate(upd); // notifica App
      setOpen(false); // chiudi popup
    } catch (e) {
      setErr(e.message);
    }
  };

  /* --- UI principale ------------------------------------------------------ */
  return (
    <div className="p-4 border rounded-xl shadow space-y-4 bg-white max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-black">Anagrafica</h2>

      {/* blocco dati */}
      <div className="space-y-1 text-sm">
        <div className="bg-gray-800 text-white p-2 rounded">
          <span className="font-semibold">Nome:</span> {customer.fullName}
        </div>
        <div className="bg-gray-800 text-white p-2 rounded">
          <span className="font-semibold">Email:</span> {customer.email}
        </div>
        <div className="bg-gray-800 text-white p-2 rounded">
          <span className="font-semibold">CF:</span> {customer.fiscalCode}
        </div>
      </div>

      <button
        className="btn mt-2"
        onClick={() => {
          reset();
          setOpen(true);
        }}>
        ✏️ Modifica
      </button>

      {/* --------------------------- MODAL ----------------------------------- */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-xl w-80 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold">Modifica anagrafica</h3>

            <Alert message={err} />

            <input
              className="input w-full bg-gray-700 text-white placeholder-gray-400"
              placeholder="Nome completo"
              value={full}
              onChange={(e) => setFull(e.target.value)}
            />
            <input
              className="input w-full bg-gray-700 text-white placeholder-gray-400"
              placeholder="Email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
            <input
              className="input w-full bg-gray-700 text-white placeholder-gray-400"
              placeholder="Codice fiscale"
              value={cf}
              onChange={(e) => setCf(e.target.value.toUpperCase())}
            />

            <div className="flex gap-2 pt-2">
              <button className="btn flex-1" onClick={save}>
                💾 Salva
              </button>
              <button
                className="btn flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setOpen(false);
                  reset();
                }}>
                ✖️ Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
