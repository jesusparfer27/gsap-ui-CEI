import React, { useEffect, useRef, useState } from "react";
import { AnimatedHamburgerButton } from "./AnimatedHamburguerButton";
import { useSliderContext } from "../context/SliderContext";
import gsap from "gsap";
import '../styles/styles.css'

export const Header = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldChangeColor, setShouldChangeColor] = useState(false);
    const [shouldChangeColorMenu, setShouldChangeColorMenu] = useState(false);
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false); // Estado para manejar la visibilidad del submenú
    const overlayRef = useRef(null);
    const textRef = useRef(null);
    const listRef = useRef(null);
    const burguerRef = useRef(null); // Nueva referencia para el botón
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

        if (isVisible) {
            // Animación de entrada: Primero overlayRef aparece, luego listRef
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

        // Actualización de los colores y el estado del slider
        const overlayRect = overlayRef.current.getBoundingClientRect();
        const textRect = textRef.current.getBoundingClientRect();
        const overlayLeft = overlayRect.left;
        const textRight = textRect.right;

        // Cambiar el color cuando el borde izquierdo del overlay toque o cruce el borde derecho del texto
        const shouldChangeColor = overlayLeft >= textRight;

        // Cambiar el color del texto solo cuando el borde izquierdo de overlayRef toque o cruce el borde derecho de textRef
        gsap.to(textRef.current, {
            color: shouldChangeColor ? "black" : "white",
            duration: 1,
            ease: "power1.out",
        });

        setSliderBehind(overlayLeft <= 0);
    }, [isVisible]);

    useEffect(() => {
        if (!overlayRef.current || !textRef.current || !burguerRef.current) return;

        const checkOverlayPosition = () => {
            const overlayRect = overlayRef.current.getBoundingClientRect();
            const textRect = textRef.current.getBoundingClientRect();
            const burgerRect = burguerRef.current.getBoundingClientRect()

            // Solo cambia el color si overlay toca el borde izquierdo de textRef
            const isOverlayTouchingText = overlayRect.left <= textRect.left;
            const isOverlayTouchingMenu = overlayRect.left <= burgerRect.left;


            if (isOverlayTouchingText !== shouldChangeColor) {
                setShouldChangeColor(isOverlayTouchingText);
                gsap.to(textRef.current, {
                    color: isOverlayTouchingText ? "white" : "black",
                    duration: 1,
                    ease: "power1.out",
                });
            }

            if (isOverlayTouchingMenu !== shouldChangeColorMenu) {
                setShouldChangeColorMenu(isOverlayTouchingMenu);
                gsap.to(burguerRef.current, {
                    color: isOverlayTouchingMenu ? "white" : "black",
                    duration: 1,
                    ease: "power1.out",
                });
            }

            requestAnimationFrame(checkOverlayPosition);
        };

        requestAnimationFrame(checkOverlayPosition);

        return () => {
            cancelAnimationFrame(checkOverlayPosition);
        };
    }, [shouldChangeColor, shouldChangeColorMenu]);

    useEffect(() => {
        if (!overlayRef.current || !burguerRef.current) return;

        const checkOverlayPosition = () => {
            const overlayRect = overlayRef.current.getBoundingClientRect();
            const burgerRect = burguerRef.current.getBoundingClientRect();
            const textRect = textRef.current.getBoundingClientRect();


            // Si el overlay ha pasado la posición del menú hamburguesa
            const isOverlayTouchingMenu = overlayRect.left <= burgerRect.left;
            const isOverlayTouchingText = overlayRect.left <= textRect.left;


            setShouldChangeColor(isOverlayTouchingText);

            setShouldChangeColor(isOverlayTouchingMenu);


            requestAnimationFrame(checkOverlayPosition);
        };

        requestAnimationFrame(checkOverlayPosition);

        return () => cancelAnimationFrame(checkOverlayPosition);
    }, []);

    useEffect(() => {
        if (isSubMenuVisible) {
            gsap.to(".subMenu", {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power4.out",
            });
            gsap.to(".parentListItem:first-child", {
                marginBottom: "0px",
                duration: 1.2,
                ease: "power4.out",
            });
            gsap.to(".parentListItem:nth-child(n+2):nth-child(-n+4)", {
                y: 130,
                duration: 1.8,
                ease: "power4.out",
            });
            gsap.to(".subMenu li:last-child", {
                marginBottom: "80px",
                duration: 1.2,
                ease: "power4.out",
            });
            gsap.to(".subMenu li", {
                marginTop: "10px",
                duration: 1.5,
                ease: "power4.out",
            });
        } else {
            gsap.to(".subMenu", {
                opacity: 0,
                y: 0,
                duration: 1.2,
                ease: "power4.in",
            });
            gsap.to(".parentListItem:first-child", {
                marginBottom: "0px",
                duration: 1.2,
                ease: "power4.in",
            });
            gsap.to(".parentListItem:nth-child(n+2):nth-child(-n+4)", {
                y: 0,  // Regresar a su posición inicial
                duration: 1.6,
                ease: "power4.in",
            });
            gsap.to(".subMenu li:last-child", {
                marginBottom: "0px", // Restaurar margen inferior
                duration: 1.2,
                ease: "power4.in",
            });
            gsap.to(".subMenu li", {
                marginTop: "0px",
                duration: 1.5,
                ease: "power4.in",
            });
        }
    }, [isSubMenuVisible]);
    




    return (
        <>
            {/* Overlay animado */}
            <div ref={overlayRef} className="absolute h-screen w-screen overflow-hidden bg-black z-[8888] flex justify-center items-center">
                <div ref={listRef} className="w-[80%] flex flex-col gap-60">
                    {/* Primera lista (Columna de 6 elementos) */}
                    <nav>
                        <ul className="flex mt-32 flex-col space-y-6 text-white text-3xl">
                            {["Collection", "Design", "Craftmanship", "Ethics"].map((item, index) => (
                                <li key={item} className="relative parentListItem">
                                <a
                                    href={`#${item.toLowerCase()}`}
                                    className="hover:text-gray-400 transition-colors"
                                    onMouseEnter={() => index === 0 && setIsSubMenuVisible(true)}
                                    onMouseLeave={() => index === 0 && setIsSubMenuVisible(false)}
                                >
                                    {item}
                                </a>
                            
                                {index === 0 && isSubMenuVisible && (
                                    <>
                                        {/* Zona segura para evitar que el menú desaparezca */}
                                        <div
                                            className="absolute left-0 w-full h-10 bg-transparent"
                                            onMouseEnter={() => setIsSubMenuVisible(true)}
                                        ></div>
                            
                                        <ul
                                            className="absolute top-full left-0 p-4 space-y-4 mt-2 subMenu"
                                            onMouseEnter={() => setIsSubMenuVisible(true)}
                                            onMouseLeave={() => setIsSubMenuVisible(false)}
                                        >
                                            {["Link 1", "Link 2", "Link 3"].map(subItem => (
                                                <li key={subItem} className="text-sm">
                                                    <a
                                                        href={`#${subItem.toLowerCase().replace(" ", "-")}`}
                                                        className="text-white hover:text-gray-400 transition-colors"
                                                    >
                                                        {subItem}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
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
                        <AnimatedHamburgerButton
                            ref={burguerRef}
                            onClick={() => setIsVisible(!isVisible)}
                            shouldChangeColor={shouldChangeColor}
                            shouldChangeColorMenu={shouldChangeColorMenu}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
