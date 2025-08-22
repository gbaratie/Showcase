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
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true,
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
              <div style={{ textAlign: 'center' }}>
                {expo.image_url && (
                  <img 
                    src={expo.image_url} 
                    alt={expo.title} 
                    style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                )}
                <h4>{expo.title}</h4>
                <p>{expo.description}</p>
                <p>{new Date(expo.start_date).toLocaleDateString()}</p>
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
          width: 40px;
          height: 40px;
        }

        .slick-prev {
          left: -50px;
        }

        .slick-next {
          right: -50px;
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
      `}</style>
    </div>
  );
}