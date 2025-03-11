import React, { createContext, useContext, useState } from 'react';

// Creamos el contexto
const SliderContext = createContext();

// Creamos un custom hook para usar el contexto
export const useSliderContext = () => {
  return useContext(SliderContext);
};

// Componente proveedor
export const SliderProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Función para alternar la visibilidad del slider
  const toggleSlider = () => {
    setIsVisible((prevIsVisible) => !prevIsVisible);
  };

  return (
    <SliderContext.Provider value={{ isVisible, toggleSlider }}>
      {children}
    </SliderContext.Provider>
  );
};
