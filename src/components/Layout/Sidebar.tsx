import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, CreditCard, ClipboardList, Settings } from 'lucide-react';
import clsx from 'clsx';
import './Sidebar.scss';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside className={clsx('sidebar', { 'sidebar--open': isOpen })}>
        <div className="sidebar__logo">
          <h1>Curator CRM</h1>
          <span>{t('free_plan', 'Free Plan')}</span>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__nav-links">
            <NavLink
              to="/"
              end
              onClick={onClose}
              className={({ isActive }) =>
                clsx('sidebar__link', { 'sidebar__link--active': isActive })
              }
            >
              <LayoutDashboard />
              <span>{t('dashboard_title', 'Dashboard')}</span>
            </NavLink>

            <NavLink
              to="/customers"
              onClick={onClose}
              className={({ isActive }) =>
                clsx('sidebar__link', { 'sidebar__link--active': isActive })
              }
            >
              <Users />
              <span>{t('customers')}</span>
            </NavLink>

            <NavLink
              to="/payments"
              onClick={onClose}
              className={({ isActive }) =>
                clsx('sidebar__link', { 'sidebar__link--active': isActive })
              }
            >
              <CreditCard />
              <span>{t('payments')}</span>
            </NavLink>

            <div className="sidebar__link sidebar__link--disabled">
              <ClipboardList />
              <span>{t('tasks')}</span>
            </div>
          </div>

          <div className="sidebar__footer">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                clsx('sidebar__link', { 'sidebar__link--active': isActive })
              }
            >
              <Settings />
              <span>{t('settings')}</span>
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
