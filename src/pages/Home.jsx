import React, { useState, useEffect } from 'react';
import { useArtworks } from '../context/ArtworkContext';
import ArtworkCard from '../components/ArtworkCard';
import { supabase } from '../supabaseClient';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Composant amélioré pour le carrousel
function Carousel({ items, renderItem, title }) {
  if (!items.length) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Affiche 3 cartes à la fois
    slidesToScroll: 1, // Fait défiler une carte à la fois
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    cssEase: 'linear'
  };

  return (
    <section className="carousel-section">
      <h3>{title}</h3>
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="carousel-slide">
            {renderItem(item)}
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default function Home() {
  const { artworks, loading } = useArtworks();
  const [aboutData, setAboutData] = useState(null);
  const [exhibitions, setExhibitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les informations de l'artiste
        const { data: aboutResult } = await supabase
          .from('about')
          .select('*')
          .single();
        setAboutData(aboutResult);

        // Récupérer les expositions à venir
        const { data: exhibitionsResult } = await supabase
          .from('exhibitions')
          .select('*')
          .order('start_date', { ascending: true });
        setExhibitions(exhibitionsResult || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || loading) {
    return <div className="container">Chargement...</div>;
  }

  return (
    <div className="container">
      {/* À propos de l'artiste */}
      <section className="artist-section">
        <div className="artist-image">
          {aboutData?.artist_photo_url && (
            <img 
              src={aboutData.artist_photo_url} 
              alt="Nadine F" 
              className="artist-photo"
            />
          )}
        </div>
        <div className="artist-info">
          <h2>À propos de l'artiste</h2>
          <p>{aboutData?.description}</p>
          <div className="social-links">
            {aboutData?.instagram_url && (
              <a href={aboutData.instagram_url} target="_blank" rel="noopener noreferrer" className="social-link">
                Instagram
              </a>
            )}
            {aboutData?.etsy_url && (
              <a href={aboutData.etsy_url} target="_blank" rel="noopener noreferrer" className="social-link">
                Etsy
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Carrousel des expos */}
      {exhibitions.length > 0 && (
        <div id="expos">
          <Carousel
            items={exhibitions}
            title="Mes prochaines expos"
            renderItem={(expo) => (
              <div className="expo-content">
                {expo.image_url && (
                  <img 
                    src={expo.image_url} 
                    alt={expo.title} 
                    style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                )}
                <h4>{expo.title}</h4>
                <p>{`Du ${new Date(expo.start_date).toLocaleDateString()} au ${new Date(expo.end_date).toLocaleDateString()}`}</p>
                <p>{expo.location}</p>
                <p className="expo-description">{expo.description}</p>
              </div>
            )}
          />
        </div>
      )}

      {/* Carrousel des œuvres */}
      <div id="oeuvres">
        <Carousel
          items={artworks}
          title="Mes œuvres"
          renderItem={(art) => (
            <ArtworkCard
              title={art.title}
              description={art.description}
              image={art.image_url}
            />
          )}
        />
      </div>

      <style>{`
        .artist-section {
          display: flex;
          gap: 3rem;
          margin-bottom: 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .artist-image {
          flex-shrink: 0;
        }

        .artist-photo {
          width: 250px;
          height: 250px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .artist-info {
          flex: 1;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .social-link {
          padding: 0.75rem 1.5rem;
          background: #e13b57;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .social-link:hover {
          background: #c4314d;
          transform: translateY(-2px);
        }

        .carousel-section {
          margin-bottom: 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .carousel-section h3 {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .carousel-slide {
          padding: 1rem;
        }

        /* Personnalisation des flèches du carousel */
        .slick-prev,
        .slick-next {
          z-index: 1;
          width: 30px;
          height: 30px;
          color: #ffffff; /* Change la couleur par défaut */
          background-color: #e13b57; /* Ajoute une couleur de fond */
          border-radius: 50%; /* Rend les flèches circulaires */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Ajoute une ombre */
          transition: all 0.3s ease;
        }

        .slick-prev:hover,
        .slick-next:hover {
          background-color: #c4314d; /* Change la couleur au survol */
          transform: scale(1.1); /* Agrandit légèrement au survol */
        }

        .slick-prev {
          left: -10px; /* Ajuste la position */
        }

        .slick-next {
          right: -10px; /* Ajuste la position */
        }

        .slick-dots {
          bottom: -30px;
        }

        .slick-dots li button:before {
          color: #e13b57;
        }

        .slick-dots li.slick-active button:before {
          color: #c4314d;
        }

        .artwork-content {
          height: 120px; /* Hauteur fixe pour uniformiser les cartes */
          padding: 1rem;
          background: rgba(255, 255, 255, 0.8); /* Fond blanc semi-transparent */
          border-radius: 8px; /* Coins arrondis */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .artwork-content h4 {
          font-size: 1.2rem;
          margin: 0.5rem 0;
        }

        .artwork-content p {
          font-size: 1rem;
          margin: 0.5rem 0;
          overflow: hidden; /* Cache le texte débordant */
          text-overflow: ellipsis; /* Ajoute "..." si le texte dépasse */
          display: -webkit-box;
          -webkit-line-clamp: 4; /* Limite à 4 lignes */
          -webkit-box-orient: vertical;
        }

        /* Style pour les cartes des expositions */
        .expo-content {
          width: 300px; /* Largeur fixe pour uniformiser les cartes */
          height: 240px; /* Réduction de la hauteur totale */
          padding: 0.8rem; /* Réduction du padding */
          background: rgba(255, 255, 255, 0.8); /* Fond blanc semi-transparent */
          border-radius: 8px; /* Coins arrondis */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre */
          display: flex;
          flex-direction: column;
          justify-content: space-between ;
          text-align: center;
          overflow: hidden; /* Empêche le contenu de dépasser */
        }

        .expo-content h4 {
          font-size: 1.2rem;
          margin: 0.3rem 0; /* Réduction de l'écart vertical */
          white-space: nowrap; /* Empêche le titre de passer à la ligne */
          overflow: hidden; /* Cache le texte débordant */
          text-overflow: ellipsis; /* Ajoute "..." si le texte dépasse */
        }

        .expo-content p {
          font-size: 1rem;
          margin: 0.3rem 0; /* Réduction de l'écart vertical */
          overflow: hidden; /* Cache le texte débordant */
          text-overflow: ellipsis; /* Ajoute "..." si le texte dépasse */
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Limite à 1 ligne pour les dates et le lieu */
          -webkit-box-orient: vertical;
        }

        .expo-description {
        height: 100px;  
        font-size: 0.9rem; /* Ajustement de la taille du texte */
          margin-top: 0.5rem; /* Réduction de l'écart avec les autres éléments */
          overflow: hidden; /* Cache le texte débordant */
          display: -webkit-box;
          text-align: center;
          -webkit-line-clamp: 4; /* Augmentation à 4 lignes pour la description */
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}