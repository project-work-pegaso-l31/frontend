import { useState } from "react";
import Customers from "./components/Customers";
import CustomerDetails from "./components/CustomerDetails";
import Accounts from "./components/Accounts";
import Transactions from "./components/Transactions";

export default function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  /* quando aggiorno anagrafica sincronizzo la lista clienti e l’oggetto selezionato */
  const handleCustomerUpdate = (updated) => {
    setSelectedCustomer(updated); // aggiorno il dettaglio
  };

  /* quando cambio cliente azzero conto selezionato */
  const selectCustomer = (c) => {
    setSelectedCustomer(c);
    setSelectedAccount(null);
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-4 grid gap-4
                    md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {/* colonna CLIENTI */}
      <Customers selected={selectedCustomer} onSelect={selectCustomer} />

      {/* colonna ANAGRAFICA */}
      {selectedCustomer && (
        <CustomerDetails customer={selectedCustomer} onUpdate={handleCustomerUpdate} />
      )}

      {/* colonna CONTI */}
      {selectedCustomer && (
        <Accounts
          customer={selectedCustomer}
          selected={selectedAccount}
          onSelect={setSelectedAccount}
        />
      )}

      {/* colonna MOVIMENTI */}
      {selectedAccount && (
        <Transactions account={selectedAccount} onAccountUpdate={setSelectedAccount} />
      )}
    </div>
  );
}
