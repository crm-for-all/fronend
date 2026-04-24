import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';

interface ThemeLanguageSwitcherProps {
  className?: string;
}

const ThemeLanguageSwitcher: React.FC<ThemeLanguageSwitcherProps> = ({ className = '' }) => {
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
    <div className={`theme-lang-switcher ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <select 
        style={{
          appearance: 'none',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '4px 32px 4px 16px',
          height: '40px',
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--color-primary)',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: 'var(--shadow-sm)',
        }}
        value={i18n.language} 
        onChange={changeLanguage}
      >
        <option value="he">עברית (HE)</option>
        <option value="en">English (EN)</option>
        <option value="ru">Русский (RU)</option>
      </select>

      <button 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%', // Circle looks better in this mockup
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-primary)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
        }}
        onClick={toggleTheme} 
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </button>
    </div>
  );
};

export default ThemeLanguageSwitcher;
