"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/ui/DataTable";
import EstimateForm from "@/components/forms/EstimateForm";
import "./page.css";

export default function Estimates() {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEstimates() {
      try {
        const res = await fetch("/api/estimates");
        const json = await res.json();
        if (json.success) {
          setEstimates(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch estimates");
      } finally {
        setLoading(false);
      }
    }
    fetchEstimates();
  }, []);

  const handleEstimateCreated = (newEstimate) => {
    setEstimates([newEstimate, ...estimates]);
    setIsModalOpen(false);
  };

  const columns = [
    {
      label: "Date",
      key: "issueDate",
      render: (row) => new Date(row.issueDate).toLocaleDateString()
    },
    {
      label: "Estimate Number",
      key: "estimateNumber",
      className: "fw-600"
    },
    {
      label: "Customer Name",
      key: "customerName"
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
    <div className="estimates-container">
      <header className="estimates-header">
        <div>
          <h1>Estimates</h1>
          <p className="subtitle">Draft, send, and manage quotes for your customers.</p>
        </div>
        <button 
          className="wave-btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Create Estimate
        </button>
      </header>

      <DataTable 
        data={estimates} 
        columns={columns} 
        loading={loading}
        emptyMessage="You haven't created any estimates yet."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Estimate"
      >
        <EstimateForm 
          onSuccess={handleEstimateCreated} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
