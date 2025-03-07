import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import '../styles/styles.css'
import { useFurniture } from "../context/FurnitureContext"; // Importamos el contexto


const FurnitureDisplay = () => {
  const [furnitures, setFurnitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentIndex, setCurrentIndex } = useFurniture(); // 🔹 Usamos el contexto
  const [isAnimating, setIsAnimating] = useState(false);

  const furnitureContainerRef = useRef(null);
  const buttonRef = useRef(null);
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

  const handleToggleFurniture = () => {
    if (!furnitureContainerRef.current || isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    tl.to([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
      y: -50, // 🔹 Movimiento más lento
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.7,
      ease: "power2.inOut",
    })
      .to(
        imageRef.current,
        {
          y: -100, // 🔹 Se mueve el doble en Y
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "-=0.5" // 🔹 Se superpone con la animación del texto
      )
      .add(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % furnitures.length);
      });
  };

  useEffect(() => {
    if (!furnitures.length) return;

    gsap.set([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
      y: 50,
      opacity: 0,
      filter: "blur(10px)",
    });

    gsap.set(imageRef.current, {
      y: 100, // 🔹 Inicia más abajo para la nueva animación
      opacity: 0,
    });

    gsap.to([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(imageRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out",
    });
  }, [currentIndex]);

  return (
    <div className="w-full flex justify-center items-center"> {/* Usa h-screen o un valor fijo */}
  {loading && <p className="text-center text-gray-500">Cargando muebles...</p>}
  {error && <p className="text-center text-red-500">Error: {error}</p>}

    {furnitures.length > 0 && (
      <div
        ref={furnitureContainerRef}
        key={furnitures[currentIndex]._id}
      >
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
                  <div className="mt-4" ref={buttonRef}>
                    <button
                      onClick={handleToggleFurniture}
                      className="text-white px-4 py-2 border-2 bg-black border-black"
                      disabled={isAnimating}
                    >
                      Cambiar Mueble
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