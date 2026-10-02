import { useState } from 'react';
import { api } from '../api.js';

const AuthForm = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = mode === 'login'
        ? await api.login({ email, password })
        : await api.register({ name, email, password });

      if (mode === 'register') {
        const loginData = await api.login({ email, password });
        onLogin(loginData);
      } else {
        onLogin(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>{mode === 'login' ? 'Welcome back 👋' : 'Create your account'}</h2>
        <p>Use the Week 2 API with JWT authentication.</p>
        {mode === 'register' && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        )}
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password (6+ characters)" minLength={6} required />
        {error && <p className="error-message">{error}</p>}
        <button className="btn btn-add" disabled={loading} type="submit">
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
        <button className="link-button" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </form>
    </main>
  );
};

export default AuthForm;
