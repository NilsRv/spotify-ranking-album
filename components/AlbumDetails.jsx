// components/AlbumDetails.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/AlbumDetails.module.css';
import defaultImage from '../public/default-disc-image.png';

export default function AlbumDetails({ album, onClose, accessToken }) {
  const [tracks, setTracks] = useState([]);
  const [albumInfo, setAlbumInfo] = useState(null);

  useEffect(() => {
    if (accessToken && album) {
      axios
        .get(`https://api.spotify.com/v1/albums/${album.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(response => {
          setAlbumInfo(response.data);
          setTracks(response.data.tracks.items);
        })
        .catch(error => {
          console.error('Error fetching album details:', error);
        });
    } else {
      setAlbumInfo(null);
      setTracks([]);
    }
  }, [accessToken, album]);

  if (!album) {
    return (
      <div className={`${styles.albumDetails} ${styles.default}`}>
        <img
          src="/default-disc-image.png"
          alt="Sélectionnez un album"
          className={styles.defaultImage}
        />
        <h2>Sélectionnez un album</h2>
      </div>
    );
  }

  if (!albumInfo) {
    return (
      <div className={styles.albumDetails}>
        <p>Chargement des détails de l&#39;album...</p>
      </div>
    );
  }

  return (
    <div className={styles.albumDetails}>
        <button className={styles.closeButton} onClick={onClose}>
            &times;
        </button>
      <img src={albumInfo.images[0]?.url} alt={albumInfo.name} />
      <h2>{albumInfo.name}</h2>
      <p>{albumInfo.artists.map(artist => artist.name).join(', ')}</p>
      <p>Date de sortie : {albumInfo.release_date}</p>
      <p>Nombre de pistes : {albumInfo.total_tracks}</p>
      <h3>Liste des pistes :</h3>
      <ul>
        {tracks.map(track => (
          <li key={track.id}>
            {track.track_number}. {track.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
