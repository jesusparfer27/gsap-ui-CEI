import React, { useEffect, useRef, useState } from "react";
import { AnimatedHamburgerButton } from "./AnimatedHamburguerButton";
import { useSliderContext } from "../context/SliderContext";
import gsap from "gsap";

export const Header = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldChangeColor, setShouldChangeColor] = useState(false);
    const overlayRef = useRef(null);
    const textRef = useRef(null);
    const listRef = useRef(null);
    const { sliderBehind, setSliderBehind } = useSliderContext();

    useEffect(() => {
        if (overlayRef.current) {
            gsap.set(overlayRef.current, { x: "100%" });
        }
        if (listRef.current) {
            gsap.set(listRef.current, { opacity: 0, y: 350 }); // Cambiado de -350 a 350
        }
    }, []);

    useEffect(() => {
        if (!overlayRef.current || !textRef.current || !listRef.current) return;
        gsap.killTweensOf(overlayRef.current);
        gsap.killTweensOf(listRef.current);

        const newX = isVisible ? "0%" : "100%";

        gsap.to(overlayRef.current, {
            x: newX,
            duration: 1.5,
            ease: "power4.out",
            onComplete: () => {
                if (isVisible) {
                    // Animación de entrada: Primero listRef aparece y luego overlayRef
                    gsap.to(overlayRef.current, {
                        x: "0%",
                        duration: 1.5,
                        ease: "power4.out",
                        onComplete: () => {
                            gsap.to(listRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 1.5,
                                ease: "power4.out",
                            });
                        },
                    });
                } else {
                    // Animación de salida: Primero listRef desaparece, luego overlayRef
                    gsap.to(listRef.current, {
                        opacity: 0,
                        y: 350,
                        duration: 1.5,
                        ease: "power4.in",
                        onComplete: () => {
                            gsap.to(overlayRef.current, {
                                x: "100%",
                                duration: 1.5,
                                ease: "power4.in",
                            });
                        },
                    });
                }
            },
            onUpdate: function () {
                const overlayRect = overlayRef.current.getBoundingClientRect();
                const textRect = textRef.current.getBoundingClientRect();
                const overlayLeft = overlayRect.left;
                const overlayRight = overlayRect.right;
                const textLeft = textRect.left;
                const textRight = textRect.right;

                const shouldChangeToWhite = overlayLeft < textRight;
                const shouldChangeToBlack = overlayRight > textLeft;

                const progress = Math.abs((overlayLeft / window.innerWidth) * 100);

                if (progress >= 90) {
                    setShouldChangeColor(isVisible);
                }

                gsap.to(textRef.current, {
                    color: shouldChangeToWhite ? "white" : "black",
                    duration: 1,
                    ease: "power1.out",
                });

                setSliderBehind(overlayLeft <= 0);
            },
        });
    }, [isVisible]);

    return (
        <>
            {/* Overlay animado */}
            <div ref={overlayRef} className="absolute h-screen w-screen overflow-hidden bg-black z-[8888] flex justify-center items-center">
                <div ref={listRef} className="w-[80%] flex flex-col gap-12">
                    {/* Primera lista (Columna de 6 elementos) */}
                    <nav>
                        <ul className="flex flex-col space-y-6 text-white text-3xl">
                            {["Collection", "Design", "Craftmanship", "Ethics"].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase()}`} className="hover:text-gray-400 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Segunda lista (3 columnas x 2 filas) */}
                    <div className="grid grid-cols-3 gap-6 text-gray-400 text-l w-[20%] mt-24">
                        {["About", "Contact", "Dealers", "News", "Care", "Press"].map((i) => (
                            <a key={i} href={`#${i.toLowerCase()}`} className="hover:text-gray-500 transition-colors">
                                {i}
                            </a>
                        ))}
                    </div>

                </div>
            </div>

            {/* Header con botón hamburguesa */}
            <div className="flex justify-center fixed top-0 left-0 w-full transition-colors duration-300" style={{ zIndex: 9999 }}>
                <div className="justify-between flex items-center w-[90%] mt-4 mb-4">
                    <div ref={textRef} className="mb-3.5 font-extrabold text-6xl" style={{ zIndex: 9999 }}>
                        master
                    </div>
                    <div style={{ zIndex: 10000 }}>
                        <AnimatedHamburgerButton onClick={() => setIsVisible((prev) => !prev)} shouldChangeColor={shouldChangeColor} />
                    </div>
                </div>
            </div>
        </>
    );
};
