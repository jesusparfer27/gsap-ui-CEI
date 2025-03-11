import React from 'react';
import { AnimatedHamburgerButton } from './AnimatedHamburguerButton';
import { useSliderContext } from '../context/SliderContext';

export const Header = () => {
    const { isVisible, toggleSlider } = useSliderContext();
  
    return (
      <div 
        className="flex justify-center fixed top-0 left-0 w-full transition-colors duration-300"
        style={{
          backgroundColor: isVisible ? 'black' : 'white',
          zIndex: 1100, // Asegura que el Header esté por encima del Slider
        }}
      >
        <div className="justify-between flex items-center w-[90%] mt-4 mb-4">
          {/* Texto "master" con mayor z-index */}
          <div 
            className={`mb-3.5 transition-colors duration-300 ${isVisible ? 'text-white' : 'text-black'}`}
            style={{ zIndex: 1200 }} // Asegura que esté por encima del slider
          >
            master
          </div>
          {/* Botón de hamburguesa con mayor z-index */}
          <div style={{ zIndex: 1200 }}>
            <AnimatedHamburgerButton 
              className={`transition-colors duration-300 ${isVisible ? 'text-white' : 'text-black'}`} 
              onClick={toggleSlider} 
            />
          </div>
        </div>
      </div>
    );
  };
  
