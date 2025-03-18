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
      duration: 1,
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
  
    // Asegurar que la animación no se repite dos veces al regresar a 0
    // if (newIndex === 0 && prevIndexRef.current === furnitures.length - 1) {
    //   setTimeout(() => {
    //     setIsAnimating(false);
    //   }, 1000);
    // }
  };
  

  // useEffect(() => {
  //   if (!furnitures.length || isAnimating || prevIndexRef.current === currentIndex) return;
  
  //   setIsAnimating(true);
  
  //   const tl = gsap.timeline({
  //     onComplete: () => {
  //       setIsAnimating(false);
  //       prevIndexRef.current = currentIndex;
  //     },
  //   });
  
  //   const wasReversed = prevIndexRef.current > currentIndex;
  //   const yOffsetText = wasReversed ? -50 : 50;
  //   const yOffsetImage = wasReversed ? -300 : 300;
  
  //   gsap.set(
  //     [textNameRef.current, textDesignerRef.current, textDescriptionRef.current],
  //     {
  //       y: yOffsetText,
  //       opacity: 0,
  //     }
  //   );
  
  //   gsap.set(imageRef.current, {
  //     y: yOffsetImage,
  //     opacity: 0,
  //   });
  
  //   tl.to(
  //     [textNameRef.current, textDesignerRef.current, textDescriptionRef.current],
  //     {
  //       y: 0,
  //       opacity: 1,
  //       duration: 0.7,
  //       ease: "power2.out",
  //     }
  //   ).to(
  //     imageRef.current,
  //     {
  //       y: 0,
  //       opacity: 1,
  //       duration: 1,
  //       ease: "power2.out",
  //     },
  //     "-=0.5"
  //   );
  
  // }, [currentIndex]);
  
  

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
