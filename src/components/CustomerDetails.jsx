export default function CustomerDetails({ customer }) {
  if (!customer) return null;

  return (
    <div className="p-4 border rounded-xl shadow space-y-2 bg-white text-gray-800">
      <h2 className="text-xl font-bold text-black">Anagrafica</h2>

      <div className="text-sm space-y-1">
        <div>
          <span className="font-semibold">Nome:</span> {customer.fullName}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {customer.email}
        </div>
        <div>
          <span className="font-semibold">Codice fiscale:</span> {customer.fiscalCode}
        </div>
      </div>
    </div>
  );
}
