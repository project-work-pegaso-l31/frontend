export default function CustomerDetails({ customer, onShowAccounts }) {
  if (!customer) return null;

  return (
    <div className="p-4 border rounded-xl shadow space-y-4 bg-white">
      <h2 className="text-xl font-bold">Anagrafica cliente</h2>

      <div className="space-y-1 text-sm text-gray-800">
        <div>
          <span className="font-semibold">Nome:</span> {customer.fullName}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {customer.email}
        </div>
        <div>
          <span className="font-semibold">CF:</span> {customer.fiscalCode}
        </div>
      </div>

      <button className="btn w-full" onClick={onShowAccounts}>
        Conti
      </button>
    </div>
  );
}
