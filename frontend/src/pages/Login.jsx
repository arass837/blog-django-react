import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import styles from './Login.module.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('token/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            window.location.href = '/';
        } catch (loginError) {
            setError('Login failed: invalid username or password.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleLogin} className={styles.loginForm}>
                <h2>Log in</h2>
                {error && <p className={styles.error}>{error}</p>}
                <div>
                    <label>Username:</label><br/>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label><br/>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Log in</button>
                <p className={styles.switchText}>
                    No account yet? <Link to="/register">Create one</Link>
                </p>
            </form>
        </div>
    );
}
