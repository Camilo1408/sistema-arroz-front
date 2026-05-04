import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Header } from "./Header.jsx";

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-app, #f3f7f3)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
