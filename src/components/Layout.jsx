import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { ListingStatsProvider } from './ListingStats';

function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ListingStatsProvider>
      <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-blue focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <Sidebar collapsed={collapsed} onToggleCollapse={setCollapsed} />
        <div
          className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
            collapsed ? 'md:ml-[68px]' : 'md:ml-64'
          } ml-0`}
        >
          <Navbar />
          <main
            id="main-content"
            className="flex-1 overflow-y-auto bg-[#f8fafc] px-4 sm:px-6 lg:px-8 py-5"
            role="main"
            tabIndex={-1}
          >
            <div className="w-full max-w-7xl mx-auto page-enter">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ListingStatsProvider>
  );
}

export default Layout;
