import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtworks } from '../context/ArtworkContext';
import { FormInput, FormTextArea } from '../components/FormComponents';
import { useForm } from '../hooks/useForm';
import { handleError } from '../utils/errorHandling';

/**
 * Page permettant d'ajouter une nouvelle œuvre. Elle utilise un formulaire
 * contrôlé pour capturer le titre, la description et l'image. Les images
 * sélectionnées sont converties en DataURL pour être stockées dans le
 * localStorage. Après l'ajout, l'utilisateur est redirigé vers la page d'accueil.
 */
export default function AddArtwork() {
  const { addArtwork } = useArtworks();
  const navigate = useNavigate();
  const { values, handleChange, resetForm } = useForm({
    title: '',
    description: ''
  });
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
    if (!values.title.trim()) return;

    setLoading(true);
    try {
      await addArtwork({
        title: values.title.trim(),
        description: values.description.trim(),
        image: imageFile,
      });
      resetForm();
      setImageFile(null);
      navigate('/');
    } catch (error) {
      handleError(error, "Erreur lors de l'ajout de l'œuvre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Ajouter une œuvre</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Nom de l'œuvre"
          name="title"
          value={values.title}
          onChange={handleChange}
          required
        />
        <FormTextArea
          label="Description"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Décrivez votre œuvre..."
        />
        <div className="form-group">
          <label htmlFor="image">Image (optionnel)</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-field"
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Ajout en cours..." : "Ajouter l'œuvre"}
        </button>
      </form>
    </div>
  );
}