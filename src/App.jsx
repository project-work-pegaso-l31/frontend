import { useState } from "react";
import Customers from "./components/Customers";
import Accounts from "./components/Accounts";
import Transactions from "./components/Transactions";
import "./index.css";

export default function App() {
  const [customer, setCustomer] = useState(null); // selezione cliente
  const [accounts, setAccounts] = useState([]); // lista conti del cliente
  const [account, setAccount] = useState(null); // conto selezionato

  /* quando scelgo un cliente, gli Accounts.jsx faranno fetch
     e richiameranno onLoadedAccounts per popolare lo stato */
  const onLoadedAccounts = (list) => {
    setAccounts(list);
    setAccount(null);
  };

  /* callback riceve conto aggiornato da Transactions.jsx */
  const onAccountUpdate = (updated) => {
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setAccount(updated);
  };

  return (
    <div className="min-h-screen p-6 grid grid-cols-3 gap-4 bg-gray-50">
      <Customers onSelect={(c) => setCustomer(c)} />

      {customer && (
        <Accounts
          customer={customer}
          list={accounts}
          onLoaded={onLoadedAccounts}
          onSelect={(a) => setAccount(a)}
        />
      )}

      {account && <Transactions account={account} onAccountUpdate={onAccountUpdate} />}
    </div>
  );
}
