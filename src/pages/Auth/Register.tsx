import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import ThemeLanguageSwitcher from '../../components/UI/ThemeLanguageSwitcher';
import './Auth.scss';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email !== confirmEmail) {
      setError(t('error_email_mismatch', 'Emails do not match.'));
      return;
    }

    if (password.length < 6) {
      setError(t('error_password_too_short', 'Password must be at least 6 characters.'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('error_password_mismatch', 'Passwords do not match.'));
      return;
    }

    setIsLoading(true);

    try {
      // API expects register, then we can likely log them in or redirect to login.
      // We don't have login response DTO directly from register (API says no access_token in register).
      await authApi.register({ email, password, name });
      
      // Auto login after register
      const loginResp = await authApi.login({ email, password });
      login(loginResp.access_token, loginResp.organizations);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__top-controls">
        <ThemeLanguageSwitcher />
      </div>
      <Card className="auth-page__card">
        <div className="auth-page__header">
          <h1>{t('register')}</h1>
          <p>{t('register_title', 'Create a new Curator CRM account')}</p>
        </div>

        {error && <div className="auth-page__error">{error}</div>}

        <form className="auth-page__form" onSubmit={handleSubmit}>
          <Input 
            label="Name" 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            placeholder="John Doe"
          />
          <Input 
            label="Email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            placeholder="user@example.com"
          />
          <Input 
            label={t('confirm_email', 'Confirm Email')} 
            type="email" 
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            fullWidth
            required
            placeholder="user@example.com"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            placeholder="••••••••"
          />
          <Input 
            label={t('confirm_password', 'Confirm Password')} 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            placeholder="••••••••"
          />
          <Button type="submit" fullWidth isLoading={isLoading}>
            {t('register')}
          </Button>
        </form>

        <div className="auth-page__footer">
          Already have an account? <Link to="/login">{t('login')}</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
