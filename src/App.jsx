import { useState } from "react";
import Customers from "./components/Customers";
import CustomerDetails from "./components/CustomerDetails";
import Accounts from "./components/Accounts";
import Transactions from "./components/Transactions";

export default function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAccounts, setShowAccounts] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <div className="min-h-screen p-6 bg-gray-100 space-y-6">
      {/* griglia principale: 3 colonne fisse */}
      <div className="grid grid-cols-3 gap-6">
        {/* --- colonna 1: elenco clienti --- */}
        <Customers
          selected={selectedCustomer}
          onSelect={(c) => {
            setSelectedCustomer(c);
            setShowAccounts(false);
            setSelectedAccount(null);
          }}
        />

        {/* --- colonna 2: anagrafica --- */}
        {selectedCustomer && (
          <CustomerDetails
            customer={selectedCustomer}
            onShowAccounts={() => setShowAccounts(true)}
          />
        )}

        {/* --- colonna 3: conti (visibile solo quando richiesto) --- */}
        {showAccounts && selectedCustomer && (
          <Accounts
            customer={selectedCustomer}
            selected={selectedAccount}
            onSelect={(a) => setSelectedAccount(a)}
          />
        )}
      </div>

      {/* se è selezionato un IBAN, mostrane i movimenti sotto la griglia */}
      {selectedAccount && (
        <Transactions
          account={selectedAccount}
          onAccountUpdate={(upd) => setSelectedAccount(upd)}
        />
      )}
    </div>
  );
}
