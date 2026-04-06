"use client";
import { useState, useEffect } from "react";
import { Plus, Search, FileText } from "lucide-react";
import "./invoices.css";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/invoices");
        const json = await res.json();
        if (json.success) {
          setInvoices(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  return (
    <div className="invoices-container">
      <header className="invoices-header">
        <div>
          <h1>Invoices</h1>
          <p className="subtitle">Manage and track your customer invoices.</p>
        </div>
        <button className="wave-btn-primary create-btn">
          <Plus size={16} /> Create an Invoice
        </button>
      </header>

      <div className="invoices-toolbar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search invoices..." />
        </div>
        <select className="filter-select">
          <option>All Statuses</option>
          <option>Draft</option>
          <option>Sent</option>
          <option>Paid</option>
        </select>
      </div>

      <div className="wave-card table-card">
        {loading ? (
          <p className="empty-state-text">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <FileText size={48} color="var(--color-primary)" />
            </div>
            <h3>No invoices yet</h3>
            <p>Create your first invoice to get paid faster.</p>
            <button className="wave-btn-secondary">
              Create an Invoice
            </button>
          </div>
        ) : (
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice Number</th>
                <th>Customer Name</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                  <td className="fw-600">{inv.invoiceNumber}</td>
                  <td>{inv.customerName}</td>
                  <td className="fw-500">${inv.total.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
