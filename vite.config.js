import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration Vite
// La propriété `base` doit correspondre au chemin du dépôt GitHub Pages.
// Pour un dépôt nommé "artiste-vitrine", le site sera déployé sous
// https://<utilisateur>.github.io/artiste-vitrine/. Dans ce cas
// la base doit être "/artiste-vitrine/".
// Si vous déployez à la racine de votre page utilisateur
// (https://<utilisateur>.github.io/), utilisez simplement '/'.

export default defineConfig({
  plugins: [react()],
  base: '/artiste-vitrine/',
});