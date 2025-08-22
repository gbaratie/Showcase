import { supabase } from '../supabaseClient';

// Services pour la section À propos
export const aboutServices = {
  // Récupérer les informations "À propos"
  getAboutInfo: async () => {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mettre à jour les informations "À propos"
  updateAboutInfo: async (aboutData) => {
    const { data, error } = await supabase
      .from('about')
      .upsert(aboutData)
      .single();

    if (error) throw error;
    return data;
  },

  // Upload de la photo de l'artiste
  uploadArtistPhoto: async (file) => {
    try {
      const cleanName = 'artist_photo';
      const fileName = `${Date.now()}_${cleanName}.jpg`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(fileName, file, { 
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Erreur upload image', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(fileName);

      if (!publicUrl) {
        throw new Error('Impossible de récupérer l\'URL du fichier');
      }

      return publicUrl;
    } catch (error) {
      console.error('Erreur complète:', error);
      throw error;
    }
  }
};

// Services pour les expositions
export const exhibitionServices = {
  // Récupérer toutes les expositions
  getAllExhibitions: async () => {
    const { data, error } = await supabase
      .from('exhibitions')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Ajouter une nouvelle exposition
  addExhibition: async (exhibitionData) => {
    const { data, error } = await supabase
      .from('exhibitions')
      .insert(exhibitionData)
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer une exposition
  deleteExhibition: async (id) => {
    const { error } = await supabase
      .from('exhibitions')
      .delete()
      .match({ id });

    if (error) throw error;
    return true;
  },

  // Upload d'image pour une exposition
  uploadExhibitionImage: async (file, title) => {
    try {
      const cleanTitle = title
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${Date.now()}_${cleanTitle}.jpg`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(fileName, file, { 
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Erreur upload image', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(fileName);

      if (!publicUrl) {
        throw new Error('Impossible de récupérer l\'URL du fichier');
      }

      return publicUrl;
    } catch (error) {
      console.error('Erreur complète:', error);
      throw error;
    }
  }
};

// Services pour les œuvres d'art
export const artworkServices = {
  // Récupérer toutes les œuvres
  getAllArtworks: async () => {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Ajouter une nouvelle œuvre
  addArtwork: async (artworkData) => {
    const { data, error } = await supabase
      .from('artworks')
      .insert(artworkData)
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer une œuvre
  deleteArtwork: async (id) => {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .match({ id });

    if (error) throw error;
    return true;
  },

  // Upload d'image pour une œuvre
  uploadArtworkImage: async (file, title) => {
    try {
      const cleanTitle = title
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${Date.now()}_${cleanTitle}.jpg`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(fileName, file, { 
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Erreur upload image', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(fileName);

      if (!publicUrl) {
        throw new Error('Impossible de récupérer l\'URL du fichier');
      }

      return publicUrl;
    } catch (error) {
      console.error('Erreur complète:', error);
      throw error;
    }
  }
};
