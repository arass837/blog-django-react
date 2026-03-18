import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styles from './Login.module.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('token/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            window.location.href = '/'; // Przeładowanie, aby zaktualizować stan App.js
        } catch (error) {
            alert('Błąd logowania: Nieprawidłowe dane');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleLogin} className={styles.loginForm}>
                <h2>Logowanie</h2>
                <div>
                    <label>Użytkownik:</label><br/>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Hasło:</label><br/>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Zaloguj się</button>
            </form>
        </div>
    );
}
