import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useFurniture } from "../context/FurnitureContext"; // Importamos el contexto

export const Footer = () => {
  const [furniture, setFurniture] = useState([]);
  const lineRef = useRef(null);
  const containerRef = useRef(null);
  const { setCurrentIndex } = useFurniture(); // Accedemos a la función para cambiar el índice

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/furniture`);
        const data = await response.json();
        setFurniture(data);
      } catch (error) {
        console.error("Error fetching furniture:", error);
      }
    };

    fetchFurniture();
  }, []);

  const moveLine = (e) => {
    if (lineRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = e.currentTarget.getBoundingClientRect();
      const offsetX = itemRect.left - containerRect.left;

      gsap.to(lineRef.current, {
        x: offsetX,
        width: itemRect.width,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const resetLine = () => {
    gsap.to(lineRef.current, {
      width: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
  <div className="absolute bottom-0 w-full p-8" ref={containerRef}>
    <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-200"></div>
    <div ref={lineRef} className="absolute top-0 left-0 h-[3px] bg-gray-600" style={{ width: 0 }}></div>

    <div className="flex pl-4">
      <div className="flex justify-center gap-8 pl-4">
        {furniture.map((item, index) => (
          <div
            key={item._id}
            className="w-[20vw] min-w-[15%] max-w-[40%] p-4 bg-white cursor-pointer transition-all"
            onMouseEnter={moveLine}
            onMouseLeave={resetLine}
            onClick={() => setCurrentIndex(index)} // 🔹 Actualizamos el contexto al hacer clic
          >
            <p>{(index + 1).toString().padStart(2, "0")}</p>
            <h3 className="text-l font-semibold">{item.nombre}</h3>
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default Footer;
