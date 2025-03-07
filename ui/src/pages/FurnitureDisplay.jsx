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
