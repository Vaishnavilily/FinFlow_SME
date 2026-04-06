"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/ui/DataTable";
import CustomerForm from "@/components/forms/CustomerForm";
import "./page.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customers");
        const json = await res.json();
        if (json.success) {
          setCustomers(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const handleCustomerCreated = (newCustomer) => {
    setCustomers([newCustomer, ...customers]);
    setIsModalOpen(false);
  };

  const columns = [
    {
      label: "Name",
      key: "name",
      className: "fw-600"
    },
    {
      label: "Email",
      key: "email",
      render: (row) => row.email || "-"
    },
    {
      label: "Phone",
      key: "phone",
      render: (row) => row.phone || "-"
    },
    {
      label: "Total Billed",
      key: "totalBilled",
      className: "fw-500",
      render: (row) => `$${(row.totalBilled || 0).toFixed(2)}`
    },
    {
      label: "Status",
      key: "status",
      render: (row) => (
        <span className={`status-badge status-${(row.status || 'active').toLowerCase()}`}>
          {row.status || 'Active'}
        </span>
      )
    }
  ];

  return (
    <div className="customers-container">
      <header className="customers-header">
        <div>
          <h1>Customers</h1>
          <p className="subtitle">Manage your client directory and contact details.</p>
        </div>
        <button 
          className="wave-btn-primary create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Add a Customer
        </button>
      </header>

      <DataTable 
        data={customers} 
        columns={columns} 
        loading={loading}
        emptyMessage="Add your first customer to build your directory."
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
      >
        <CustomerForm 
          onSuccess={handleCustomerCreated} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
