import { createContext, useContext, useState } from "react";

// Creamos el contexto
const SliderContext = createContext();

// Hook para acceder fácilmente al contexto
export const useSliderContext = () => useContext(SliderContext);

export const SliderProvider = ({ children }) => {
  const [sliderBehind, setSliderBehind] = useState(false);

  return (
    <SliderContext.Provider value={{ sliderBehind, setSliderBehind }}>
      {children}
    </SliderContext.Provider>
  );
};
