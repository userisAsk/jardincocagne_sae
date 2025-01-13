import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Header from '../components/Header';

function Home() {
  useEffect(() => {
    console.log('Composant monté');
  }, []);
  
  return (
    <div>
      <Hero />
    </div>
  );
}

export default Home;
