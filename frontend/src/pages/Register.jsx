import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import styles from './Login.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('register/', form);
      const tokenResponse = await api.post('token/', {
        username: form.username,
        password: form.password,
      });
      localStorage.setItem('access_token', tokenResponse.data.access);
      localStorage.setItem('refresh_token', tokenResponse.data.refresh);
      navigate('/', { replace: true });
      window.location.reload();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const first = Object.values(data).flat()[0];
        setError(typeof first === 'string' ? first : 'Could not create account.');
      } else {
        setError('Could not create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Create account</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div>
          <label htmlFor="username">Username:</label><br />
          <input id="username" name="username" value={form.username} onChange={update} required />
        </div>

        <div>
          <label htmlFor="email">Email:</label><br />
          <input id="email" name="email" type="email" value={form.email} onChange={update} required />
        </div>

        <div>
          <label htmlFor="password">Password:</label><br />
          <input id="password" name="password" type="password" value={form.password} onChange={update} required />
        </div>

        <div>
          <label htmlFor="password_confirm">Repeat password:</label><br />
          <input id="password_confirm" name="password_confirm" type="password" value={form.password_confirm} onChange={update} required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className={styles.switchText}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
