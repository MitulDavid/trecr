import React from 'react';

const Attributions = () => {
  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        width: '200px',
        margin: 'auto',
        textAlign: 'justify',
      }}
    >
      <p style={{ fontSize: '30px', fontWeight: '700' }}>Attributions: </p>
      <img
        src='https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg'
        alt='TMDB Attribution'
      />
      <p style={{ fontSize: '20px' }}>
        TMDb is the source of the data and images used on this website. This
        product uses the TMDb API but is not endorsed or certified by TMDb.
      </p>
    </div>
  );
};

export default Attributions;
