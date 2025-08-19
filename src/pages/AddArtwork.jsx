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
  const [imageData, setImageData] = useState('');

  // Gère le changement de fichier image et convertit le fichier en DataURL
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setImageData('');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageData(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Soumission du formulaire : ajoute l'œuvre et revient sur la page d'accueil
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }
    addArtwork({ title: title.trim(), description: description.trim(), image: imageData });
    // Réinitialise le formulaire
    setTitle('');
    setDescription('');
    setImageData('');
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
        <button type="submit">Ajouter l'œuvre</button>
      </form>
    </div>
  );
}