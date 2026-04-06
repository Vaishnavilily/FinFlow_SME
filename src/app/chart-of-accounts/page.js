"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/ui/DataTable";
import AccountForm from "@/components/forms/AccountForm";
import "./page.css";

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch("/api/accounts");
        const json = await res.json();
        if (json.success) {
          setAccounts(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch accounts");
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  const handleAccountCreated = (newAccount) => {
    setAccounts([...accounts, newAccount].sort((a, b) => a.code.localeCompare(b.code)));
    setIsModalOpen(false);
  };

  const columns = [
    {
      label: "Code",
      key: "code",
      className: "fw-600"
    },
    {
      label: "Name",
      key: "name",
      className: "fw-500"
    },
    {
      label: "Type",
      key: "type",
      render: (row) => (
        <span className={`type-badge type-${row.type.toLowerCase()}`}>
          {row.type}
        </span>
      )
    },
    {
      label: "Balance",
      key: "balance",
      className: "fw-600",
      render: (row) => `$${(row.balance || 0).toFixed(2)}`
    }
  ];

  return (
    <div className="accounts-container">
      <header className="accounts-header">
        <div>
          <h1>Chart of Accounts</h1>
          <p className="subtitle">Manage the foundational categories of your accounting system.</p>
        </div>
        <button 
          className="wave-btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Add Account
        </button>
      </header>

      <DataTable 
        data={accounts} 
        columns={columns} 
        loading={loading}
        emptyMessage="Your chart of accounts is empty. Add a new account to categorize transactions."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Account"
      >
        <AccountForm 
          onSuccess={handleAccountCreated} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
