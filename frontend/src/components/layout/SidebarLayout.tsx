import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/sidebar/Sidebar";

const SidebarLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
