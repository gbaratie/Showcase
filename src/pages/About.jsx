import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [etsyUrl, setEtsyUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  async function fetchAboutData() {
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .single();

      if (error) throw error;
      setAboutData(data);
      setDescription(data.description);
      setInstagramUrl(data.instagram_url);
      setEtsyUrl(data.etsy_url);
      setPreviewUrl(data.artist_photo_url);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      let photoUrl = previewUrl;
      
      if (imageFile) {
        const uploadResult = await addArtwork({
          image: imageFile,
          bucket: 'about',
          skipDatabaseInsert: true
        });
        photoUrl = uploadResult.imageUrl;
      }

      // Utiliser upsert avec match sur la première ligne
      const { error } = await supabase
        .from('about')
        .upsert({
          id: 1, // Forcer l'ID à 1 pour toujours mettre à jour la même ligne
          description,
          instagram_url: instagramUrl,
          etsy_url: etsyUrl,
          artist_photo_url: photoUrl
        })
        .match({ id: 1 }); // S'assurer de mettre à jour la ligne avec id=1

      if (error) throw error;
      alert('Informations mises à jour avec succès !');
    } catch (error) {
      console.error('Erreur:', error.message);
      alert('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) {
    return <div className="container">Chargement...</div>;
  }

  return (
    <div className="container">
      <h2>À propos de l'artiste</h2>
      
      {aboutData ? (
        <>
          {aboutData.artist_photo_url && (
            <img 
              src={aboutData.artist_photo_url} 
              alt="Photo de l'artiste"
              style={{
                maxWidth: '300px',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}
            />
          )}
          
          <div className="about-content">
            <p>{aboutData.description}</p>
            
            <div className="social-links">
              {aboutData.instagram_url && (
                <a href={aboutData.instagram_url} target="_blank" rel="noopener noreferrer" className="social-link">
                  Me suivre sur Instagram
                </a>
              )}
              {aboutData.etsy_url && (
                <a href={aboutData.etsy_url} target="_blank" rel="noopener noreferrer" className="social-link">
                  Ma boutique Etsy
                </a>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Aucune information n'est disponible pour le moment.</p>
      )}

      <form onSubmit={handleSubmit}>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de l'artiste"
          required
        />
        
        <input 
          type="url"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          placeholder="URL Instagram"
        />
        
        <input 
          type="url"
          value={etsyUrl}
          onChange={(e) => setEtsyUrl(e.target.value)}
          placeholder="URL Etsy"
        />
        
        <input 
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files.length > 0) {
              setImageFile(e.target.files[0]);
              setPreviewUrl(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
        
        {previewUrl && (
          <img 
            src={previewUrl} 
            alt="Aperçu"
            style={{
              maxWidth: '300px',
              borderRadius: '8px',
              marginTop: '1rem',
              marginBottom: '1rem'
            }}
          />
        )}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Mise à jour...' : 'Mettre à jour les informations'}
        </button>
      </form>

      <style>{`
        .about-content {
          max-width: 800px;
        }

        .social-links {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
        }

        .social-link {
          padding: 0.8rem 1.5rem;
          background: #e13b57;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .social-link:hover {
          background: #c4314d;
        }

        form {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        textarea {
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          resize: none;
        }

        input[type="url"], input[type="file"] {
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
        }

        button {
          padding: 1rem;
          background: #e13b57;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        button:hover {
          background: #c4314d;
        }
      `}</style>
    </div>
  );
}