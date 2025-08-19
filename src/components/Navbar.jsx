import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Composant de navigation principal.
 * Affiche le titre du site et trois liens : Œuvres, Ajouter et À propos.
 * Utilise NavLink pour appliquer la classe "active" automatiquement
 * lorsque l'URL correspond au lien courant.
 */
export default function Navbar() {
  return (
    <header>
      <h1>Vitrine Artiste</h1>
      <nav>
        <NavLink to="/" end>
          Œuvres
        </NavLink>
        <NavLink to="/ajouter">
          Ajouter une œuvre
        </NavLink>
        <NavLink to="/a-propos">
          À propos
        </NavLink>
      </nav>
    </header>
  );
}