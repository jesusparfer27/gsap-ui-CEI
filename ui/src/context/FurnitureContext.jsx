import { createContext, useState, useContext } from "react";

const FurnitureContext = createContext();

export const FurnitureProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <FurnitureContext.Provider value={{ currentIndex, setCurrentIndex }}>
      {children}
    </FurnitureContext.Provider>
  );
};

export const useFurniture = () => useContext(FurnitureContext);
