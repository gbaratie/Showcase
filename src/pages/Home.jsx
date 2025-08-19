import React from 'react';
import { useArtworks } from '../context/ArtworkContext';
import ArtworkCard from '../components/ArtworkCard';

/**
 * Page d'accueil qui affiche la liste des œuvres enregistrées et des liens
 * vers les réseaux sociaux et boutiques de l'artiste.
 */
export default function Home() {
  const { artworks } = useArtworks();

  return (
    <div className="container">
      <h2>Œuvres</h2>
      {artworks.length === 0 ? (
        <p>Aucune œuvre enregistrée pour le moment. Utilisez l'onglet « Ajouter une œuvre » pour en ajouter une.</p>
      ) : (
        <div className="artworks-grid">
          {artworks.map((art) => (
            <ArtworkCard key={art.id} title={art.title} description={art.description} image={art.image} />
          ))}
        </div>
      )}

      <div className="external-links">
        <a
          href="https://www.instagram.com/votre_profil_instagram"
          target="_blank"
          rel="noopener noreferrer"
          title="Profil Instagram"
        >
          Instagram
        </a>
        <a
          href="https://www.etsy.com/fr/shop/votre_boutique_etsy"
          target="_blank"
          rel="noopener noreferrer"
          title="Boutique Etsy"
        >
          Etsy
        </a>
      </div>
    </div>
  );
}