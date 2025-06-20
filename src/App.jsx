import { useState } from "react";
import Customers from "./components/Customers";
import Accounts from "./components/Accounts";
import Transactions from "./components/Transactions";
import "./index.css";

export default function App() {
  const [customer, setCustomer] = useState(null);
  const [account, setAccount] = useState(null);

  return (
    <div className="min-h-screen p-6 grid grid-cols-3 gap-4 bg-gray-50">
      <Customers
        onSelect={(c) => {
          setCustomer(c);
          setAccount(null);
        }}
      />
      {customer && <Accounts customer={customer} onSelect={(a) => setAccount(a)} />}
      {account && <Transactions account={account} />}
    </div>
  );
}
