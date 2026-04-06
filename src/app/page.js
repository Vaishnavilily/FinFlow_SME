"use client";
import { ArrowRight, Receipt, PiggyBank, Briefcase } from "lucide-react";
import "./page.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome (Finflow SME)</h1>
      </header>

      <section className="welcome-banner">
        <h2>Where do you want to start?</h2>
        <p>Choose an action below to get up and running quickly.</p>
        
        <div className="cards-grid">
          {/* Card 1 */}
          <div className="wave-card action-card">
            <div className="card-icon-wrapper" style={{ backgroundColor: "#EBF3FA", color: "var(--color-primary)" }}>
              <Receipt size={32} />
            </div>
            <h3>Get Paid for Your Work</h3>
            <p>Create professional invoices and get paid faster.</p>
            <button className="wave-btn-primary card-action-btn">
              Create an Invoice <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2 */}
          <div className="wave-card action-card">
            <div className="card-icon-wrapper" style={{ backgroundColor: "#F0F9E8", color: "var(--color-success)" }}>
              <PiggyBank size={32} />
            </div>
            <h3>Organize Your Finances</h3>
            <p>Track your income and expenses effortlessly.</p>
            <button className="wave-btn-secondary card-action-btn">
              Add a Transaction <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3 */}
          <div className="wave-card action-card">
            <div className="card-icon-wrapper" style={{ backgroundColor: "#FFF4E5", color: "#F2994A" }}>
              <Briefcase size={32} />
            </div>
            <h3>Capture Your Receipts</h3>
            <p>Upload receipts and sync them with transactions.</p>
            <button className="wave-btn-secondary card-action-btn">
              Scan Receipt <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="dashboard-overview">
        <div className="wave-card overview-card">
          <div className="overview-header">
            <h3>Cash Flow</h3>
            <select className="overview-select">
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="placeholder-chart">
            {/* We can build a real chart later */}
            <p className="placeholder-text">Chart data will appear here once you add transactions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
