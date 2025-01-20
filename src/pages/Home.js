import React, { useEffect } from 'react';
import Hero from '../components/Hero';

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
