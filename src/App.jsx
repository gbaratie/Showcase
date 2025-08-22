import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddArtwork from './pages/AddArtwork';
import About from './pages/About';
import Modifier from './pages/Modifier';
import { ArtworkProvider } from './context/ArtworkContext';

/**
 * Composant racine de l'application. Il définit les routes et englobe
 * l'application dans le provider d'œuvres pour rendre les données
 * accessibles à tous les composants.
 */
function App() {
  return (
    <ArtworkProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ajouter" element={<AddArtwork />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/modifier" element={<Modifier />} />
        {/* Catch-all pour toute route inconnue */}
        <Route
          path="*"
          element={
            <div className="container">
              <h2>Page non trouvée</h2>
              <p>La page que vous recherchez n'existe pas.</p>
            </div>
          }
        />
      </Routes>
    </ArtworkProvider>
  );
}

export default App;