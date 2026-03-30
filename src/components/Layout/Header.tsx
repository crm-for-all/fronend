import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, User, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Header.scss';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize theme based on system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('crm_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('crm_theme', newTheme);
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="header">
      <div className="header__title">
        <button className="header__mobile-toggle" onClick={onMenuClick}>
          <Menu />
        </button>
        {/* Breadcrumb or dynamic title could go here if needed. According to screenshot it's a specific badge */}
        <span className="badge">AD</span>
        <span>לוח בקרה</span> {/* Example static title based on screenshot, can localize later */}
      </div>

      <div className="header__actions">
        <select 
          className="header__select" 
          value={i18n.language} 
          onChange={changeLanguage}
        >
          <option value="he">עברית (HE)</option>
          <option value="en">English (EN)</option>
          <option value="ru">Русский (RU)</option>
        </select>

        <button className="header__icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>

        <div className="header__profile-wrapper" ref={profileRef}>
          <button 
            className="header__icon-btn" 
            aria-label="Profile"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <User />
          </button>
          
          {isProfileOpen && (
            <div className="profile-dropdown">
              <button 
                className="profile-dropdown__logout"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
              >
                <LogOut size={16} />
                <span>{t('logout', 'התנתק')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
