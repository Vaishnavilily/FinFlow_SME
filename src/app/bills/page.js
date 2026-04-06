"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/ui/DataTable";
import BillForm from "@/components/forms/BillForm";
import "./page.css";

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchBills() {
      try {
        const res = await fetch("/api/bills");
        const json = await res.json();
        if (json.success) {
          setBills(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch bills");
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []);

  const handleBillCreated = (newBill) => {
    setBills([newBill, ...bills]);
    setIsModalOpen(false);
  };

  const columns = [
    {
      label: "Date",
      key: "issueDate",
      render: (row) => new Date(row.issueDate).toLocaleDateString()
    },
    {
      label: "Bill Number",
      key: "billNumber",
      className: "fw-600"
    },
    {
      label: "Vendor Name",
      key: "vendorName"
    },
    {
      label: "Amount",
      key: "total",
      className: "fw-500",
      render: (row) => `$${row.total.toFixed(2)}`
    },
    {
      label: "Status",
      key: "status",
      render: (row) => (
        <span className={`status-badge status-${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="bills-container">
      <header className="bills-header">
        <div>
          <h1>Bills</h1>
          <p className="subtitle">Track and manage your vendor bills and expenses.</p>
        </div>
        <button 
          className="wave-btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Create a Bill
        </button>
      </header>

      <DataTable 
        data={bills} 
        columns={columns} 
        loading={loading}
        emptyMessage="Create your first bill to keep track of expenses."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Bill"
      >
        <BillForm 
          onSuccess={handleBillCreated} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
