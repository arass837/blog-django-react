import React from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.widget}>
                <h3>ABOUT BLOG</h3>
                <p>Welcome to Arek’s blog! I’m an enthusiastic hobbyist exploring the world of programming and technologies in 2026, with a special love for React on the frontend and Django on the backend. Join me as I experiment, learn, and share my coding adventures!</p>
            </div>
            <div className={styles.widget}>
                <h3>Kategorie</h3>
                <ul>
                    <li>React</li>
                    <li>Django</li>
                    <li>Web Design</li>
                </ul>
            </div>
        </aside>
    );
}
