import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charge les œuvres depuis Supabase
  useEffect(() => {
    async function fetchArtworks() {
      setLoading(true);
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Erreur chargement œuvres Supabase', error);
        setArtworks([]);
      } else {
        setArtworks(data || []);
      }
      setLoading(false);
    }
    fetchArtworks();
  }, []);

  /**
   * Ajoute une nouvelle œuvre dans Supabase (upload image + insert row)
   * @param {Object} params - { title, description, image, bucket, skipDatabaseInsert }
   */
  async function addArtwork({ title = '', description = '', image, bucket = 'artworks', skipDatabaseInsert = false }) {
    let imageUrl = '';
    if (image) {
      // Nettoyage du nom de fichier pour Supabase Storage
      const cleanTitle = title || 'image'
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '') // retire les accents
        .replace(/[^a-zA-Z0-9_-]/g, '_'); // remplace tout caractère non autorisé
      const fileName = `${Date.now()}_${cleanTitle}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, image, { contentType: image.type });
      if (uploadError) {
        console.error(`Erreur upload image dans ${bucket}`, uploadError);
        throw uploadError;
      } else {
        imageUrl = supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl;
      }
    }

    // Si skipDatabaseInsert est true, on retourne juste l'URL de l'image
    if (skipDatabaseInsert) {
      return { imageUrl };
    }

    // Insert l'œuvre dans la table artworks
    const { data, error } = await supabase
      .from('artworks')
      .insert([
        {
          title,
          description,
          image_url: imageUrl,
        },
      ])
      .select();
    if (error) {
      console.error('Erreur ajout œuvre', error);
    } else {
      setArtworks((prev) => [data[0], ...prev]);
    }
  }

  /**
   * Supprime une œuvre de Supabase (et l'image du storage si présente)
   * @param {string} id - L'identifiant de l'œuvre à supprimer
   * @param {string} imageUrl - L'URL publique de l'image (optionnel)
   */
  async function deleteArtwork(id, imageUrl) {
    // Supprime l'œuvre de la table
    const { error } = await supabase.from('artworks').delete().eq('id', id);
    if (error) {
      console.error('Erreur suppression œuvre', error);
      return;
    }
    // Supprime l'image du storage si présente
    if (imageUrl) {
      try {
        // Récupère le chemin complet après le bucket dans l'URL publique
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        // Le chemin attendu est "artworks/nom_du_fichier"
        const bucketIndex = pathParts.findIndex((p) => p === 'artworks');
        const filePath = pathParts.slice(bucketIndex).join('/');
        await supabase.storage.from('artworks').remove([filePath]);
      } catch (e) {
        console.warn('Erreur suppression image storage', e);
      }
    }
    // Met à jour la liste locale
    setArtworks((prev) => prev.filter((art) => art.id !== id));
  }

  return (
    <ArtworkContext.Provider value={{ artworks, addArtwork, deleteArtwork, loading }}>
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