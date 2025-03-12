import React, { useEffect, useRef, useState } from "react";
import { AnimatedHamburgerButton } from "./AnimatedHamburguerButton";
import gsap from "gsap";

export const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sliderBehind, setSliderBehind] = useState(false);
  const overlayRef = useRef(null);

  // Inicializar el contenedor fuera de pantalla solo en el montaje
  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { x: "100%" });
    }
  }, []);

  // Llamar a la animación cuando isVisible cambie
  useEffect(() => {
    if (!overlayRef.current) return;

    // Detiene cualquier animación en curso antes de iniciar una nueva
    gsap.killTweensOf(overlayRef.current);

    const newX = isVisible ? "0%" : "100%";

    gsap.to(overlayRef.current, {
      x: newX,
      duration: 2,
      ease: "power3.out",
      onUpdate: () => {
        const sliderPosition = overlayRef.current.getBoundingClientRect().x;
        setSliderBehind(sliderPosition < window.innerWidth / 2);
      },
      onComplete: () => {
        console.log(`La animación ha terminado - Slider ${isVisible ? "visible" : "oculto"}`);
      },
    });
  }, [isVisible]);

  return (
    <>
      {/* Contenedor deslizante */}
      <div ref={overlayRef} className="absolute h-screen w-screen overflow-hidden bg-black z-[8888]">
        <div className="flex flex-col items-center justify-center text-white h-full">
          <h2 className="text-4xl mb-8">Master</h2>
          <nav className="space-y-6">
            <ul>
              <li><a href="#home" className="text-lg">Home</a></li>
              <li><a href="#services" className="text-lg">Services</a></li>
              <li><a href="#about" className="text-lg">About</a></li>
              <li><a href="#contact" className="text-lg">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Header con el botón y el texto */}
      <div className="flex justify-center fixed top-0 left-0 w-full transition-colors duration-300" style={{ zIndex: 9999 }}>
        <div className="justify-between flex items-center w-[90%] mt-4 mb-4">
          {/* Texto "master" */}
          <div className={`mb-3.5 transition-colors duration-300 ${sliderBehind ? "text-white" : "text-black"}`} style={{ zIndex: 9999 }}>
            master
          </div>
          {/* Botón de hamburguesa */}
          <div style={{ zIndex: 10000 }}>
            <AnimatedHamburgerButton
              className={`transition-colors duration-300 ${sliderBehind ? "text-white" : "text-black"}`}
              onClick={() => {
                console.log("Toggle triggered");
                setIsVisible((prev) => !prev);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
