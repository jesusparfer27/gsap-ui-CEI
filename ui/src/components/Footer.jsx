import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export const Footer = () => {
  const [furniture, setFurniture] = useState([]);
  const lineRef = useRef(null);
  const containerRef = useRef(null);

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

  // Función para mover la línea con GSAP
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

  // Restablecer la línea cuando el mouse sale
  const resetLine = () => {
    gsap.to(lineRef.current, {
      width: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Función para formatear el número del producto con dos dígitos
  const numberProducts = (index) => {
    return (index + 1).toString().padStart(2, '0'); // Formatea el índice a dos dígitos
  };

  return (
    <div className="relative w-full p-8" ref={containerRef}>
      {/* Línea de fondo gris con blur */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-200"></div>

      {/* Línea animada que se mueve en hover */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 h-[3px] bg-gray-600"
        style={{ width: 0 }}
      ></div>

      {/* Contenedor de productos */}
      <div className="flex pl-4 ">
        <div className="flex justify-center gap-8 pl-4 ">
          {furniture.map((item, index) => (
            <div
              key={item._id}
              className="w-[20vw] min-w-[15%] max-w-[40%] p-4 bg-white cursor-pointer transition-all"
              onMouseEnter={moveLine}
              onMouseLeave={resetLine}
            >
              {/* Mostrar el número de producto formateado */}
              <p>{numberProducts(index)}</p>
              <h3 className="text-l font-semibold">{item.nombre}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
