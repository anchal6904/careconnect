import React from 'react';
import AboutHero from '../../components/about/AboutHero';
import AboutServices from '../../components/about/AboutServices';
import AboutContact from '../../components/about/AboutContact';

const AboutPage = () => {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutServices />
      <AboutContact />
    </div>
  );
};

export default AboutPage; 