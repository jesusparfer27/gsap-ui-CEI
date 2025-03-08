import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useFurniture } from "../context/FurnitureContext";

export const Footer = () => {
  const lineRef = useRef(null);
  const containerRef = useRef(null);
  const {
    furnitures,
    setCurrentIndex,
    textNameRef,
    textDesignerRef,
    textDescriptionRef,
    imageRef,
    isAnimating,
    setIsAnimating,
    currentIndex,
  } = useFurniture();

  const [activeIndex, setActiveIndex] = useState(currentIndex);

  // Sincronizar activeIndex con currentIndex del contexto
  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

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

  const handleFooterClick = (index) => {
    if (isAnimating || currentIndex === index) return;

    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    const isForward = index > currentIndex;
    const outY = isForward ? -50 : 50;
    const inY = isForward ? 50 : -50;

    tl.to([textNameRef.current, textDesignerRef.current, textDescriptionRef.current], {
      y: outY,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    })
      .to(
        imageRef.current,
        {
          y: outY * 6,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "-=0.4"
      )
      .add(() => {
        setCurrentIndex(index);
      });
  };

  useEffect(() => {
    console.log("Índice actual en contexto:", currentIndex);
  }, [currentIndex]);

  return (
    <div className="absolute bottom-0 w-full p-8" ref={containerRef}>
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-200"></div>
      <div ref={lineRef} className="absolute top-0 left-0 h-[3px] bg-gray-600" style={{ width: 0 }}></div>

      <div className="flex pl-4">
        <div className="flex justify-center gap-8 pl-4">
          {furnitures.map((item, index) => (
            <div
              key={item._id}
              className="w-[20vw] min-w-[15%] max-w-[40%] p-4 bg-white cursor-pointer transition-all"
              onMouseEnter={moveLine}
              onMouseLeave={resetLine}
              onClick={() => handleFooterClick(index)}
            >
              <p
                className="text-gray-500 font-bold"
              >
                {(index + 1).toString().padStart(2, "0")}
              </p>
              <h3
                className={`text-l transition-all font-bold ${activeIndex === index ? 'text-black' : 'text-gray-500'}`}
              >
                {item.nombre}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
