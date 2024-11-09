// pages/index.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AlbumDetails from '../components/AlbumDetails';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';

export default function Home() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Récupération des tokens depuis l'URL après l'authentification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      window.history.replaceState({}, null, '/'); // Nettoie l'URL
    }
  }, []);

  // Fonction pour rafraîchir le token d'accès (si nécessaire)
  const refreshAccessToken = () => {
    axios
      .get(`/api/refresh_token?refresh_token=${refreshToken}`)
      .then(response => {
        setAccessToken(response.data.access_token);
      })
      .catch(error => {
        console.error(error);
        setError('Impossible de rafraîchir le token.');
      });
  };

  // Récupération des albums les plus écoutés
  useEffect(() => {
    if (accessToken) {
      axios
        .get(
          'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(response => {
          const tracks = response.data.items;
          const albumMap = {};

          tracks.forEach(track => {
            const album = track.album;
            const albumId = album.id;

            if (!albumMap[albumId]) {
              albumMap[albumId] = {
                id: albumId,
                name: album.name,
                image: album.images[0]?.url || '',
                artist: album.artists.map(artist => artist.name).join(', '),
                count: 1,
              };
            } else {
              albumMap[albumId].count += 1;
            }
          });

          const albumList = Object.values(albumMap);
          albumList.sort((a, b) => b.count - a.count);
          setAlbums(albumList);
        })
        .catch(error => {
          console.error(error);
          setError('Une erreur est survenue lors de la récupération des données.');
        });
    }
  }, [accessToken]);

  // Gestion de la connexion
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    window.location.href = '/';
  };

  return (
    <div className={styles.container}>
      <Navbar
        accessToken={accessToken}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <main className={styles.mainContent}>
        <div className={styles.leftContent}>
            <div className={styles.albumContainer}>
            {!accessToken ? (
                <div className={styles.loginPrompt}>
                <h2>Connectez-vous avec Spotify pour voir vos albums les plus écoutés</h2>
                <button onClick={handleLogin}>Se connecter avec Spotify</button>
                </div>
            ) : (
                <>
                <h2>Vos Albums/EPs les plus écoutés</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className={styles.albumGrid}>
                    {albums.map((album, index) => (
                    <div
                        key={index}
                        className={styles.albumCard}
                        onClick={() => setSelectedAlbum(album)}
                    >
                        <img src={album.image} alt={album.name} />
                        <h3>{album.name}</h3>
                        <p>{album.artist}</p>
                        <p>Morceaux dans le Top 50 : {album.count}</p>
                    </div>
                    ))}
                </div>
                </>
            )}
            </div>
        </div>
        <div className={styles.rightPanel}>
            <AlbumDetails
            album={selectedAlbum}
            onClose={() => setSelectedAlbum(null)}
            accessToken={accessToken}
            />
        </div>
      </main>
      <Footer/>
    </div>
  );
}
