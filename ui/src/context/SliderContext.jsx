import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const SliderContext = createContext();

// Proveedor del contexto
export const SliderProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Función para alternar la visibilidad del Slider
  const toggleSlider = () => {
    console.log('Toggling slider visibility'); // Agrega esto para depurar
    setIsVisible((prev) => !prev);
  };
  
  return (
    <SliderContext.Provider value={{ isVisible, toggleSlider }}>
      {children}
    </SliderContext.Provider>
  );
};

// Hook para consumir el contexto
export const useSliderContext = () => {
  return useContext(SliderContext);
};
