import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider } from "@/context/ThemeContext"; 

export const metadata = {
  title: "Finflow - Financial Management Dashboard",
  description: "A premium financial management dashboard for SMEs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap everything in ThemeProvider so dark mode applies globally */}
        <ThemeProvider>
          <SettingsProvider>
            <div className="layout-container">
              <Sidebar />
              <main className="main-content">
                {children}
              </main>
            </div>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
