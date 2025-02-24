import React from 'react';

const FeatureCard = ({ title, onClick }) => {
  return (
    <div className="feature-card">
      <h3 className="feature-title">{title}</h3>
      <button className="learn-more" onClick={onClick}>
        Learn more
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
};

export default FeatureCard;
