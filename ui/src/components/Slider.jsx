import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { useSliderContext } from '../context/SliderContext';

const Slider = () => {
  const { isVisible } = useSliderContext();

  useEffect(() => {
    const slider = document.querySelector('.slider-container');
    if (isVisible) {
      gsap.to(slider, {
        x: 0, // Desliza el contenedor desde la izquierda
        duration: 2,
        ease: 'power3.inOut',
      });
    } else {
      gsap.to(slider, {
        x: '-100%', // Desliza fuera de la pantalla
        duration: 2,
        ease: 'power3.inOut',
      });
    }
  }, [isVisible]);

  return (
    <div
      className={`slider-container fixed top-0 left-0 w-full h-screen bg-black ${isVisible ? 'block' : 'hidden'}`}
      style={{ zIndex: 9999 }} // Asegúrate de que el slider tenga un z-index alto
    />
  );
};

export default Slider;
