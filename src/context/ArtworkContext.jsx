import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexte permettant de partager la liste des œuvres entre les composants
 * sans avoir à propager les propriétés manuellement à chaque niveau.
 */
const ArtworkContext = createContext();

/**
 * Fournisseur du contexte des œuvres. Il encapsule la logique de
 * persistance dans le localStorage du navigateur et expose une API simple
 * pour lire et ajouter des œuvres.
 *
 * @param {React.ReactNode} children - Les composants enfants ayant accès au contexte.
 */
export function ArtworkProvider({ children }) {
  // Charge les œuvres depuis le localStorage ou initialement un tableau vide.
  const [artworks, setArtworks] = useState(() => {
    try {
      const stored = localStorage.getItem('artworks');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des œuvres depuis le stockage local', error);
      return [];
    }
  });

  // Sauvegarde les œuvres dans le localStorage à chaque mise à jour.
  useEffect(() => {
    try {
      localStorage.setItem('artworks', JSON.stringify(artworks));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des œuvres dans le stockage local', error);
    }
  }, [artworks]);

  /**
   * Ajoute une nouvelle œuvre à la liste.
   * @param {Object} artwork - L'œuvre à ajouter.
   * @param {string} artwork.title - Le titre de l'œuvre.
   * @param {string} artwork.description - Description détaillée.
   * @param {string} [artwork.image] - URL ou DataURL de l'image.
   */
  function addArtwork(artwork) {
    setArtworks((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...artwork,
      },
    ]);
  }

  return (
    <ArtworkContext.Provider value={{ artworks, addArtwork }}>
      {children}
    </ArtworkContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte des œuvres.
 * Permet d'éviter d'importer useContext et le contexte dans chaque composant.
 */
export function useArtworks() {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error('useArtworks doit être utilisé à l’intérieur d’un ArtworkProvider');
  }
  return context;
}