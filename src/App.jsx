import { useState } from "react";
import Customers from "./components/Customers";
import CustomerDetails from "./components/CustomerDetails";
import Accounts from "./components/Accounts";
import Transactions from "./components/Transactions";

export default function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* col 1: clienti */}
        <Customers
          selected={selectedCustomer}
          onSelect={(c) => {
            setSelectedCustomer(c);
            setSelectedAccount(null); // reset IBAN
          }}
        />

        {/* col 2: anagrafica */}
        {selectedCustomer && <CustomerDetails customer={selectedCustomer} />}

        {/* col 3: conti */}
        {selectedCustomer && (
          <Accounts
            customer={selectedCustomer}
            selected={selectedAccount}
            onSelect={setSelectedAccount}
          />
        )}

        {/* col 4: movimenti */}
        {selectedAccount && (
          <Transactions account={selectedAccount} onAccountUpdate={setSelectedAccount} />
        )}
      </div>
    </div>
  );
}
