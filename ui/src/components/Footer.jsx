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
    prevIndexRef,
  } = useFurniture();

  const [activeIndex, setActiveIndex] = useState(currentIndex);

  // Sincronizar activeIndex con currentIndex del contexto
  useEffect(() => {
    setActiveIndex(currentIndex);
    moveLineToIndex(currentIndex);
  }, [currentIndex]);

  const moveLine = (e) => {
    if (lineRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = e.currentTarget.getBoundingClientRect();
      const offsetX = itemRect.left - containerRect.left;

      gsap.to(lineRef.current, {
        x: offsetX,
        width: 250,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const moveLineToIndex = (index) => {
    if (lineRef.current && containerRef.current) {
      const items = containerRef.current.querySelectorAll(".footer-item");
      if (items[index]) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const itemRect = items[index].getBoundingClientRect();
        const offsetX = itemRect.left - containerRect.left;

        gsap.to(lineRef.current, {
          x: offsetX,
          width: 250,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  const resetLine = () => {
    moveLineToIndex(activeIndex);
  };

  const handleFooterClick = (index) => {
    if (isAnimating || currentIndex === index) return;

    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(index);
        prevIndexRef.current = index;
        setIsAnimating(false);
      },
    });

    const isForward = index > currentIndex;
    const outY = isForward ? -50 : 50;
    const inY = isForward ? 50 : -50;

    tl.to(
      [textNameRef.current, textDesignerRef.current, textDescriptionRef.current],
      {
        y: outY,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      }
    )
      .to(
        imageRef.current,
        {
          y: outY * 8,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        "-=0.6"
      )
      .add(() => {
        setCurrentIndex(index);
      });
  };

  useEffect(() => {
    if (furnitures.length) {
      moveLineToIndex(0); // Mueve la línea al primer elemento al montar el componente
    }
  }, [furnitures]);
  
  

  useEffect(() => {
    if (!furnitures.length || isAnimating) return;

    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

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

    if (currentIndex === 0) {
      tl.fromTo(
        imageRef.current,
        {
          y: -300,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=1"
      );

      tl.fromTo(
        [textNameRef.current, textDesignerRef.current, textDescriptionRef.current],
        {
          y: -50,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=1"
      );
    }
    prevIndexRef.current = currentIndex;
  }, [currentIndex]);

  return (
    <div className="absolute bottom-0 w-full p-8 lg:p-4 2xl:p-8" ref={containerRef}>
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-200"></div>
      <div ref={lineRef} className="absolute top-0 left-0 h-[3px] bg-gray-600" style={{ width: 0 }}></div>

      <div className="flex pl-4">
        <div className="flex justify-center gap-8 pl-4 lg:gap-16 2xl:gap-4">
          {furnitures.map((item, index) => (
            <div
              key={item._id}
              className="footer-item w-[20vw] min-w-[15%] max-w-[40%] p-4 bg-white cursor-pointer transition-all"
              onMouseEnter={moveLine}
              onMouseLeave={resetLine}
              onClick={() => handleFooterClick(index)}
            >
              <p className="text-gray-500 font-bold lg:text-xs 2xl:text-base">{(index + 1).toString().padStart(2, "0")}</p>
              <h3 className={` lg:text-sm 2xl:text-lg transition-all font-bold ${activeIndex === index ? "text-black" : "text-gray-500"}`}>
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
