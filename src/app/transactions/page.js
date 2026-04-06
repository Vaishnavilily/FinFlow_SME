"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/ui/DataTable";
import TransactionForm from "@/components/forms/TransactionForm";
import "./page.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        const json = await res.json();
        if (json.success) {
          setTransactions(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const handleTransactionCreated = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
  };

  const columns = [
    {
      label: "Date",
      key: "date",
      render: (row) => new Date(row.date).toLocaleDateString()
    },
    {
      label: "Description",
      key: "description",
      className: "fw-500"
    },
    {
      label: "Category",
      key: "category",
      render: (row) => row.category || "-"
    },
    {
      label: "Amount",
      key: "amount",
      render: (row) => (
        <span className={row.type === 'Income' ? 'amount-income' : 'amount-expense'}>
          {row.type === 'Income' ? '+' : '-'}${row.amount.toFixed(2)}
        </span>
      )
    },
    {
      label: "Status",
      key: "status",
      render: (row) => (
        <span className={`status-badge status-${(row.status || 'completed').toLowerCase()}`}>
          {row.status || 'Completed'}
        </span>
      )
    }
  ];

  return (
    <div className="transactions-container">
      <header className="transactions-header">
        <div>
          <h1>Transactions</h1>
          <p className="subtitle">View and add your income and expenses.</p>
        </div>
        <button 
          className="wave-btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Add Transaction
        </button>
      </header>

      <DataTable 
        data={transactions} 
        columns={columns} 
        loading={loading}
        emptyMessage="No transactions found. Add a transaction to start tracking."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add Income/Expense"
      >
        <TransactionForm 
          onSuccess={handleTransactionCreated} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
