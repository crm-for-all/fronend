import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="layout__main">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="layout__content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
