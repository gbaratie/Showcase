import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useArtworks } from '../context/ArtworkContext';

export default function Modifier() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [isLoading, setIsLoading] = useState(false);

  // Vérification de l'authentification
  useEffect(() => {
    const auth = localStorage.getItem('isAuth');
    if (auth !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="modifier-page">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          À propos
        </button>
        <button 
          className={`tab ${activeTab === 'artworks' ? 'active' : ''}`}
          onClick={() => setActiveTab('artworks')}
        >
          Œuvres
        </button>
        <button 
          className={`tab ${activeTab === 'exhibitions' ? 'active' : ''}`}
          onClick={() => setActiveTab('exhibitions')}
        >
          Expositions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'about' && <AboutSection />}
        {activeTab === 'artworks' && <ArtworksSection />}
        {activeTab === 'exhibitions' && <ExhibitionsSection />}
      </div>

      <style>{`
        .modifier-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .tab {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 8px;
          background: #2a3547;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .tab:hover {
          background: #374357;
        }

        .tab.active {
          background: #e13b57;
        }

        .tab-content {
          background: #21293a;
          padding: 2rem;
          border-radius: 12px;
        }
        
        /* Styles pour les labels et les champs */
        label {
          color: white;
        }
        
        input[type="text"],
        input[type="number"],
        input[type="date"],
        textarea {
          color: white;
          background-color: #2a3547;
          border: 1px solid #374357;
        }
        
        h3 {
          color: white;
        }
      `}</style>
    </div>
  );
}

function AboutSection() {
  const { addArtwork } = useArtworks(); // On va réutiliser la fonction d'upload
  const [description, setDescription] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [etsyUrl, setEtsyUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');

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
      if (data) {
        setDescription(data.description || '');
        setInstagramUrl(data.instagram_url || '');
        setEtsyUrl(data.etsy_url || '');
        setPreviewUrl(data.artist_photo_url || '');
      }
    } catch (error) {
      console.error('Erreur:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      let photoUrl = previewUrl;
      
      if (imageFile) {
        // Utiliser la fonction d'upload avec le bucket "about"
        const uploadResult = await addArtwork({
          image: imageFile,
          bucket: 'about',
          skipDatabaseInsert: true // Option pour ne pas insérer dans la table artworks
        });
        photoUrl = uploadResult.imageUrl;
      }

      const { error } = await supabase
        .from('about')
        .upsert({
          id: 1, // Force l'ID à 1 pour toujours mettre à jour la même ligne
          description,
          instagram_url: instagramUrl,
          etsy_url: etsyUrl,
          artist_photo_url: photoUrl
        }, { 
          onConflict: 'id' // Met à jour la ligne existante si l'ID existe déjà
        });

      if (error) throw error;
      setPreviewUrl(photoUrl);
      setImageFile(null);
      alert('Informations mises à jour avec succès !');
    } catch (error) {
      console.error('Erreur:', error.message);
      alert('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="about-form">
      <div className="form-group">
        <label>Photo de l'artiste</label>
        <div className="image-upload">
          {(imageFile || previewUrl) && (
            <img 
              src={imageFile ? URL.createObjectURL(imageFile) : previewUrl} 
              alt="Aperçu" 
              className="preview-image"
            />
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Description de l'artiste..."
        />
      </div>

      <div className="form-group">
        <label>Lien Instagram</label>
        <input
          type="url"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          placeholder="https://instagram.com/..."
        />
      </div>

      <div className="form-group">
        <label>Lien Etsy</label>
        <input
          type="url"
          value={etsyUrl}
          onChange={(e) => setEtsyUrl(e.target.value)}
          placeholder="https://etsy.com/shop/..."
        />
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>

      <style>{`
        .about-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: #fff;
          font-weight: 500;
        }

        .image-upload {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preview-image {
          max-width: 300px;
          border-radius: 8px;
        }

        input[type="url"],
        textarea {
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          background: #2a3547;
          color: #fff;
          font-size: 1rem;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-button {
          padding: 1rem;
          border: none;
          border-radius: 8px;
          background: #e13b57;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          background: #c4314d;
        }

        .submit-button:disabled {
          background: #666;
          cursor: not-allowed;
        }

        .input-field {
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          background: #2a3547;
          color: #fff;
          font-size: 1rem;
        }

        .input-field:focus {
          outline: 2px solid #e13b57;
        }

        textarea.input-field {
          resize: vertical;
          min-height: 100px;
        }
      `}</style>
    </form>
  );
}

function ArtworksSection() {
  const { artworks, addArtwork, deleteArtwork } = useArtworks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
      await addArtwork({
        title: title.trim(),
        description: description.trim(),
        image: imageFile,
      });

      setTitle('');
      setDescription('');
      setImageFile(null);
      alert('Œuvre ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur:', error.message);
      alert('Erreur lors de l\'ajout de l\'œuvre');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteArtwork(id);
      alert('Œuvre supprimée avec succès !');
    } catch (error) {
      console.error('Erreur:', error.message);
      alert('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('artworks')
        .delete()
        .match({ id });

      if (error) throw error;
      
      setArtworks(artworks.filter(artwork => artwork.id !== id));
      alert('Œuvre supprimée avec succès !');
    } catch (error) {
      console.error('Erreur:', error.message);
      alert('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="artworks-section">
      <h3>Ajouter une œuvre</h3>
      <form onSubmit={handleSubmit} className="artwork-form">
        <div className="form-row">
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>


        <div className="form-group">
          <label>Image *</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handleImageUpload}
          />
          {imageFile && (
            <img 
              src={URL.createObjectURL(imageFile)} 
              alt="Aperçu" 
              className="preview-image"
            />
          )}
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Ajout en cours...' : 'Ajouter l\'œuvre'}
        </button>
      </form>

      <h3>Œuvres existantes</h3>
      <div className="artworks-grid">
        {artworks.map(artwork => (
          <div key={artwork.id} className="artwork-card">
            <img src={artwork.image_url} alt={artwork.title} />
            <div className="artwork-info">
              <h4>{artwork.title}</h4>
              <button 
                onClick={() => handleDelete(artwork.id)}
                className="delete-button"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .artworks-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .artwork-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .artworks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .artwork-card {
          background: #2a3547;
          border-radius: 8px;
          overflow: hidden;
        }

        .artwork-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .artwork-info {
          padding: 1rem;
        }

        .artwork-info h4 {
          margin: 0 0 0.5rem 0;
          color: #fff;
        }

        .artwork-info p {
          margin: 0;
          color: #aaa;
        }

        .delete-button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background: #e13b57;
          color: #fff;
          cursor: pointer;
        }

        .delete-button:hover {
          background: #c4314d;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}

function ExhibitionsSection() {
  const { addArtwork } = useArtworks();
  const [exhibitions, setExhibitions] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  async function fetchExhibitions() {
    try {
      const { data, error } = await supabase
        .from('exhibitions')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      if (data) setExhibitions(data);
    } catch (error) {
      console.error('Erreur:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        // Utiliser la fonction d'upload avec le bucket "exhibitions"
        const uploadResult = await addArtwork({
          image: imageFile,
          bucket: 'exhibitions',
          skipDatabaseInsert: true // Option pour ne pas insérer dans la table artworks
        });
        imageUrl = uploadResult.imageUrl;
      }

      const { error } = await supabase
        .from('exhibitions')
        .insert({
          title,
          description,
          location,
          start_date: startDate,
          end_date: endDate,
          image_url: imageUrl
        });

      if (error) throw error;
      
      setTitle('');
      setDescription('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setImageFile(null);
      
      fetchExhibitions();
      alert('Exposition ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur:', error.message);
      alert('Erreur lors de l\'ajout de l\'exposition');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette exposition ?')) {
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('exhibitions')
        .delete()
        .match({ id });

      if (error) throw error;
      
      setExhibitions(exhibitions.filter(exhibition => exhibition.id !== id));
      alert('Exposition supprimée avec succès !');
    } catch (error) {
      console.error('Erreur:', error.message);
      alert('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="exhibitions-section">
      <h3>Ajouter une exposition</h3>
      <form onSubmit={handleSubmit} className="exhibition-form">
        <div className="form-row">
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Lieu</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date de début *</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Date de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {imageFile && (
            <img 
              src={URL.createObjectURL(imageFile)} 
              alt="Aperçu" 
              className="preview-image"
            />
          )}
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Ajout en cours...' : 'Ajouter l\'exposition'}
        </button>
      </form>

      <h3>Expositions existantes</h3>
      <div className="exhibitions-grid">
        {exhibitions.map(exhibition => (
          <div key={exhibition.id} className="exhibition-card">
            {exhibition.image_url && (
              <img src={exhibition.image_url} alt={exhibition.title} />
            )}
            <div className="exhibition-info">
              <h4>{exhibition.title}</h4>
              <p>{exhibition.location}</p>
              <p>{new Date(exhibition.start_date).toLocaleDateString()}</p>
              <button 
                onClick={() => handleDelete(exhibition.id)}
                className="delete-button"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .exhibitions-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .exhibition-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .exhibitions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .exhibition-card {
          background: #2a3547;
          border-radius: 8px;
          overflow: hidden;
        }

        .exhibition-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .exhibition-info {
          padding: 1rem;
        }

        .exhibition-info h4 {
          margin: 0 0 0.5rem 0;
          color: #fff;
        }

        .exhibition-info p {
          margin: 0;
          color: #aaa;
        }
      `}</style>
    </div>
  );
}
