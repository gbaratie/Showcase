import React from 'react';

/**
 * Affiche une carte pour une œuvre donnée.
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.title - Le nom de l'œuvre.
 * @param {string} props.description - Description détaillée.
 * @param {string} [props.image] - URL ou DataURL de l'image de l'œuvre.
 */
export default function ArtworkCard({ title, description, image }) {
  return (
    <article className="artwork-card">
      {image ? (
        <img src={image} alt={title} className="artwork-image" />
      ) : (
        <div className="artwork-image" aria-hidden="true" />
      )}
      <div className="artwork-content">
        <h2 className="artwork-title">{title}</h2>
        <p className="artwork-description">{description}</p>
      </div>
    </article>
  );
}