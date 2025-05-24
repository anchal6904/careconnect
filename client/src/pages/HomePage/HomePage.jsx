import React from 'react';
import Hero from '../../components/Hero/Hero';
import Stats from '../../components/Stats/Stats';
import FAQ from '../../components/FAQ/FAQ';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <Hero />
      <Stats />
      <FAQ />
    </div>
  );
};

export default HomePage; 