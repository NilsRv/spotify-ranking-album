// components/Navbar.js

import styles from '../styles/Navbar.module.css';

export default function Navbar({ accessToken, handleLogin, handleLogout }) {
  return (
    <nav className={styles.navbar}>
      <h1>Spotify Album Ranking</h1>
      {!accessToken ? (
        <button onClick={handleLogin} className={styles.button}>
          Se connecter avec Spotify
        </button>
      ) : (
        <button onClick={handleLogout} className={styles.button}>
          Se déconnecter
        </button>
      )}
    </nav>
  );
}
