import { useRef, useEffect } from "react";
import { useFurniture } from "../context/FurnitureContext";
import gsap from "gsap";
import "../styles/styles.css";

const FurnitureDisplay = () => {
  const {
    furnitures,
    loading,
    error,
    currentIndex,
    setCurrentIndex,
    isAnimating,
    prevIndexRef,
    setIsAnimating,
    handleToggleFurniture,
    furnitureContainerRef,
    textNameRef,
    textDesignerRef,
    textDescriptionRef,
    imageRef
  } = useFurniture();

  const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      // Si el índice ha cambiado, realiza la animación
      gsap.fromTo(
        [textNameRef.current, textDesignerRef.current, textDescriptionRef.current, imageRef.current],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
      prevIndexRef.current = currentIndex;  // Actualiza el índice previo
    }
  }, [currentIndex]); // Se ejecuta cuando currentIndex cambia

  return (
    <div className="w-full flex justify-center items-center h-[70vh]">
      {loading && <p className="text-center text-gray-500">Cargando muebles...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {furnitures.length > 0 && (
        <div className="flex flex-col justify-center h-full items-center" ref={furnitureContainerRef} key={furnitures[currentIndex]._id}>
          <div className="flex w-full height_container gap-52">
            <div className="md:w-1/2 flex flex-col  justify-center items-start">
              <div className="w-full flex flex-col justify-center">
                <p ref={textDesignerRef} className="text-gray-500 text-sm mt-2 mb-2">
                  <strong>{furnitures[currentIndex].diseñador}</strong>
                </p>
                <h2 ref={textNameRef} className="text-2xl font-semibold text-black">
                  {furnitures[currentIndex].nombre}
                </h2>
                <p ref={textDescriptionRef} className="text-gray-600 mt-2 max-w-[50vh] mt-6 mb-6">
                  {furnitures[currentIndex].descripcion}
                </p>
                {furnitures.length > 1 && (
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleToggleFurniture(currentIndex === furnitures.length - 1 ? -1 : 1)}
                      className="text-white px-4 py-2 border-2 bg-black border-black"
                      disabled={isAnimating}
                    >
                      Product Details
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <img
                ref={imageRef}
                src={`${VITE_IMAGE_URL}${furnitures[currentIndex].imagen}`}
                alt={furnitures[currentIndex].nombre}
                className="min-h-[50vh] object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurnitureDisplay;
