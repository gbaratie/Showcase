import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtworks } from '../context/ArtworkContext';

/**
 * Page permettant d'ajouter une nouvelle œuvre. Elle utilise un formulaire
 * contrôlé pour capturer le titre, la description et l'image. Les images
 * sélectionnées sont converties en DataURL pour être stockées dans le
 * localStorage. Après l'ajout, l'utilisateur est redirigé vers la page d'accueil.
 */
export default function AddArtwork() {
  const { addArtwork } = useArtworks();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gère le changement de fichier image
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file || null);
  };

  // Soumission du formulaire : upload image + ajout œuvre
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await addArtwork({
      title: title.trim(),
      description: description.trim(),
      image: imageFile,
    });
    setTitle('');
    setDescription('');
    setImageFile(null);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Ajouter une œuvre</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Nom de l'œuvre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre œuvre..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image (optionnel)</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Ajout en cours..." : "Ajouter l'œuvre"}
        </button>
      </form>
    </div>
  );
}