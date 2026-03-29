import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

        <button className="header__icon-btn" aria-label="Notifications">
          <Bell />
        </button>
      </div>
    </header>
  );
};

export default Header;
