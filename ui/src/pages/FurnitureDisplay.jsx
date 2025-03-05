import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const FurnitureDisplay = () => {
  const [furnitures, setFurnitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // Nueva bandera para controlar animaciones

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
  
    tl.to(
      [textNameRef.current, textDesignerRef.current, textDescriptionRef.current, imageRef.current],
      {
        y: -50,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.7, // 🔹 Aumentamos duración para hacerla más lenta
        ease: "power2.inOut",
      }
    ).add(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % furnitures.length);
    });
  };
  
  useEffect(() => {
    if (!furnitures.length) return;
  
    gsap.set(
      [textNameRef.current, textDesignerRef.current, textDescriptionRef.current, imageRef.current],
      {
        y: 50,
        opacity: 0,
        filter: "blur(10px)",
      }
    );
  
    gsap.to(
      [textNameRef.current, textDesignerRef.current, textDescriptionRef.current, imageRef.current],
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1, // 🔹 Animación de entrada más suave
        ease: "power2.out",
      }
    );
  }, [currentIndex]);
  

  return (
    <div className="max-w-6xl mx-auto p-6">
      {loading && <p className="text-center text-gray-500">Cargando muebles...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="flex justify-center">
        {furnitures.length > 0 && (
          <div
            ref={furnitureContainerRef}
            key={furnitures[currentIndex]._id}
            className="bg-white p-6 flex flex-col gap-6 items-center transition-all"
          >
            <div className="flex">
              <div className="w-full md:w-1/2">
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
                      disabled={isAnimating} // Evitar spam de clics
                    >
                      Cambiar Mueble
                    </button>
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2">
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
    </div>
  );
};

export default FurnitureDisplay;
