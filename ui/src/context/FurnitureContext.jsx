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

  const prevIndexRef = useRef(currentIndex);

  const VITE_API_BACKEND = import.meta.env.VITE_API_BACKEND;

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
    const goingBackwards = direction === -1;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(newIndex);
        prevIndexRef.current = newIndex;
        setIsAnimating(false);
      },
    });

    const yOffsetText = goingBackwards ? 50 : -50;
    const yOffsetImage = goingBackwards ? 300 : -300;

    tl.to([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
      y: yOffsetText,
      opacity: 0,
      duration: 1.4,
      ease: "power2.inOut",
    }).to(
      imageRef.current,
      {
        y: yOffsetImage,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      "-=1.1"
    );
  };

  useEffect(() => {
    if (!furnitures.length || isAnimating) return;
  
    setIsAnimating(true);
  
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });
  
    const wasReversed = prevIndexRef.current > currentIndex;
  
    // Solo establecemos los valores iniciales una vez, al iniciar el efecto
    gsap.set([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
      y: wasReversed ? -50 : 50,
      opacity: 0,
    });
  
    gsap.set(imageRef.current, {
      y: wasReversed ? -300 : 300,
      opacity: 0,
    });
  
    // Animación de aparición del texto solo si no está visible
    tl.to([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });
  
    // Animación de la imagen
    tl.to(imageRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out",
    });
  
    // Si el índice es 0, hacer que la imagen se desplace desde el top
    if (currentIndex === 0) {
      tl.fromTo(
        imageRef.current,
        {
          y: -300, // Desplazamiento inicial desde -300
        },
        {
          y: 0, // Animación a 0
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=1"
      );
  
      // Animación del texto para el índice 0
      tl.fromTo(
        [textNameRef.current, textDesignerRef.current, textDescriptionRef.current],
        {
          y: -50, // Desplazamiento inicial desde -50
        },
        {
          y: 0, // Animación a 0
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=1" // Sincronizamos las animaciones
      );
    }
  
    // Actualizar el índice anterior
    prevIndexRef.current = currentIndex;
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
        imageRef,
      }}
    >
      {children}
    </FurnitureContext.Provider>
  );
};

export const useFurniture = () => useContext(FurnitureContext);
