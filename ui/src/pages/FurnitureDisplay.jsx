import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import "../styles/styles.css";
import { useFurniture } from "../context/FurnitureContext";

const FurnitureDisplay = () => {
  const [furnitures, setFurnitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentIndex, setCurrentIndex } = useFurniture();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevIndexRef = useRef(currentIndex); // 🔹 Guarda el índice anterior

  const furnitureContainerRef = useRef(null);
  const textNameRef = useRef(null);
  const textDesignerRef = useRef(null);
  const textDescriptionRef = useRef(null);
  const imageRef = useRef(null);

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
    if (!furnitureContainerRef.current || isAnimating) return;
    setIsAnimating(true);

    const newIndex = (currentIndex + direction + furnitures.length) % furnitures.length;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
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

    prevIndexRef.current = currentIndex; // 🔹 Guardamos el índice actual como el anterior
  }, [currentIndex]);

  return (
    <div className="w-full flex justify-center items-center">
      {loading && <p className="text-center text-gray-500">Cargando muebles...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {furnitures.length > 0 && (
        <div ref={furnitureContainerRef} key={furnitures[currentIndex]._id}>
          <div className="flex w-full height_container">
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <p ref={textDesignerRef} className="text-gray-500 text-sm mt-2">
                Diseñado por: <strong>{furnitures[currentIndex].diseñador}</strong>
              </p>
              <h2 ref={textNameRef} className="text-2xl font-semibold text-black">
                {furnitures[currentIndex].nombre}
              </h2>
              <p ref={textDescriptionRef} className="text-gray-600 mt-2">
                {furnitures[currentIndex].descripcion}
              </p>
              {furnitures.length > 1 && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleToggleFurniture(currentIndex === furnitures.length - 1 ? -1 : 1)}
                    className="text-white px-4 py-2 border-2 bg-black border-black"
                    disabled={isAnimating}
                  >
                    {currentIndex === furnitures.length - 1}
                    Cambiar Furniture
                  </button>
                </div>
              )}
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <img
                ref={imageRef}
                src={`${VITE_IMAGE_URL}${furnitures[currentIndex].imagen}`}
                alt={furnitures[currentIndex].nombre}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurnitureDisplay;
