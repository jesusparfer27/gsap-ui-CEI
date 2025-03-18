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
    <div className="w-full flex justify-center items-center h-[80vh]">
      {loading && <p className="text-center text-gray-500">Cargando muebles...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {furnitures.length > 0 && (
        <div className="flex flex-col w-screen justify-center h-screen items-center mb-4" ref={furnitureContainerRef}>
          <div className="flex w-[80%] height_container gap-52 mb-4">
            <div className="md:w-1/2 flex flex-col  justify-center items-start">
              <div className="w-full flex h-full flex-col justify-start">
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
                className="min-h-[30vh] object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurnitureDisplay;
