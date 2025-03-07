import { createContext, useState, useContext, useEffect, useRef } from "react";
import gsap from "gsap";

const FurnitureContext = createContext();

export const FurnitureProvider = ({ children }) => {
  const [furnitures, setFurnitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const furnitureContainerRef = useRef(null);
  const textNameRef = useRef(null);
  const textDesignerRef = useRef(null);
  const textDescriptionRef = useRef(null);
  const imageRef = useRef(null);

  const prevIndexRef = useRef(currentIndex); // Guarda el índice anterior

  const VITE_API_BACKEND = import.meta.env.VITE_API_BACKEND;
  const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    const fetchFurnitures = async () => {
      try {
        const response = await fetch(`${VITE_API_BACKEND}/furniture`);
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setFurnitures(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFurnitures();
  }, []);

  const handleToggleFurniture = (direction = 1) => {
    if (isAnimating || furnitures.length === 0) return;
  
    setIsAnimating(true);
  
    const newIndex = (currentIndex + direction + furnitures.length) % furnitures.length;
  
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(newIndex);
        setIsAnimating(false); // Asegúrate de setear esto solo al finalizar la animación
      },
    });
  
    // Definir animación dependiendo de la dirección
    if (direction === 1) {
      // 🔹 Animación hacia adelante
      tl.to([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
        y: -50,
        opacity: 0,
        duration: 1.4,
        ease: "power2.inOut",
      })
        .to(
          imageRef.current,
          {
            y: -300,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "-=1.1"
        );
    } else {
      // 🔹 Animación en reversa
      tl.to([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
        y: 50,
        opacity: 0,
        duration: 1.4,
        ease: "power2.inOut",
      })
        .to(
          imageRef.current,
          {
            y: 300,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "-=1.1"
        );
    }
  };

  useEffect(() => {
    if (!furnitures.length || isAnimating) return;

    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // Restaurar desde diferentes posiciones según la dirección del cambio
    const wasReversed = prevIndexRef.current > currentIndex;

    gsap.set([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
      y: wasReversed ? -50 : 50,
      opacity: 0,
    });

    gsap.set(imageRef.current, {
      y: wasReversed ? -300 : 300,
      opacity: 0,
    });

    tl.to([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });

    tl.to(imageRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out",
    });

    prevIndexRef.current = currentIndex; // Guardamos el índice actual como el anterior
  }, [currentIndex]);
  
  return (
    <FurnitureContext.Provider
      value={{
        furnitures,
        loading,
        error,
        currentIndex,
        setCurrentIndex,
        isAnimating,
        setIsAnimating,
        prevIndexRef,
        handleToggleFurniture,
        furnitureContainerRef,
        textNameRef,
        textDesignerRef,
        textDescriptionRef,
        imageRef
      }}
    >
      {children}
    </FurnitureContext.Provider>
  );
};

export const useFurniture = () => useContext(FurnitureContext);
