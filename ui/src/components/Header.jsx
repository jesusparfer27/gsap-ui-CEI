import React, { useEffect, useRef, useState } from "react";
import { AnimatedHamburgerButton } from "./AnimatedHamburguerButton";
import { useSliderContext } from "../context/SliderContext";
import gsap from "gsap";
import '../styles/styles.css'


export const Header = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [furnituresSlider, setFurnituresSlider] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0); // Controlador del índice para la imagen
    const [shouldChangeColor, setShouldChangeColor] = useState(false);
    const [shouldChangeColorMenu, setShouldChangeColorMenu] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false); // Estado para manejar la visibilidad del submenú
    const overlayRef = useRef(null);
    const textRef = useRef(null);
    const listRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const burguerRef = useRef(null); // Nueva referencia para el botón
    const imageRef = useRef(null)
    const [error, setError] = useState(null);
    const { sliderBehind, setSliderBehind } = useSliderContext();

    const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
    const VITE_API_BACKEND = import.meta.env.VITE_API_BACKEND;



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

            gsap.set(".subMenu li:first-child", { y: 40, opacity: 0, duration: 1 });
            gsap.set(".subMenu li:nth-child(2)", { y: 0, opacity: 0, duration: 1 });
            gsap.set(".subMenu li:nth-child(3)", { y: -40, opacity: 0, duration: 1 });

            gsap.to(".subMenu li", {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.1,
            });

            const yValue = window.matchMedia("(max-width: 1028px)").matches ? 80 : 100; // Menos desplazamiento en md

            gsap.to(".parentListItem:nth-child(n+2):nth-child(-n+4)", {
                y: yValue,
                duration: 1.8,
                ease: "power4.out",
            });

            gsap.to(".subMenu li:last-child", {
                marginBottom: "80px",
                duration: 1.2,
                ease: "power4.out",
            });

        } else {
            gsap.to(".subMenu li:first-child", { y: -40, opacity: 0, duration: 1 });
            gsap.to(".subMenu li:nth-child(2)", { y: 0, opacity: 0, duration: 1 });
            gsap.to(".subMenu li:nth-child(3)", { y: 40, opacity: 0, duration: 1 });

            gsap.to(".parentListItem:nth-child(n+2):nth-child(-n+4)", {
                y: 0,
                duration: 1.6,
                ease: "power4.in",
            });

        }
    }, [isSubMenuVisible]);



    useEffect(() => {
        const fetchFurnitures = async () => {
            try {
                const response = await fetch(`${VITE_API_BACKEND}/furniture/slider`);
                if (!response.ok) throw new Error("Error al obtener los datos");
                const data = await response.json();
                setFurnituresSlider(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFurnitures();
    }, []);


    useEffect(() => {
        gsap.set(imageRef.current, { opacity: 0, y: 200, duration: 1 }); // Estado inicial claro
    }, []);

    const handleMouseEnterSubMenu = (index) => {
        if (index === 0) { // Solo permite la animación en el primer hijo
            setShowImage(true);
            setCurrentIndex(index);
        }
    };


    const handleMouseLeaveSubMenu = () => {
        if (imageRef.current) {
            gsap.to(imageRef.current, {
                opacity: 0,
                y: 200,
                duration: 1,
                ease: "power4.in",
                onComplete: () => {
                    setShowImage(false);
                }
            });
        }
    };

    const handleMouseLeaveSafeZone = () => {
        console.log("Saliste del área segura!");

        gsap.to(".subMenu li:first-child", {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power4.in",
            stagger: 0.1, // Hace que la animación sea escalonada
            onComplete: () => {
                setIsSubMenuVisible(false); // Oculta el menú después de la animación
            },
        });
        gsap.to(".subMenu li:nth-child(2)", {
            y: 0,
            opacity: 0,
            duration: 1,
            ease: "power4.in",
            stagger: 0.1, // Hace que la animación sea escalonada
            onComplete: () => {
                setIsSubMenuVisible(false); // Oculta el menú después de la animación
            },
        });
        gsap.to(".subMenu li:nth-child(3)", {
            y: -40,
            opacity: 0,
            duration: 1,
            ease: "power4.in",
            stagger: 0.1, // Hace que la animación sea escalonada
            onComplete: () => {
                setIsSubMenuVisible(false); // Oculta el menú después de la animación
            },
        });
    };

    useEffect(() => {
        if (imageRef.current && showImage) {
            gsap.fromTo(
                imageRef.current,
                {
                    opacity: 0,
                    duration: 2,
                    y: 200,
                    immediateRender: false
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 2,
                    ease: "power4.out"
                }
            );
        } else if (imageRef.current) {
            gsap.to(imageRef.current, {
                opacity: 0,
                y: 200,
                duration: 1.5,
                ease: "power4.in"
            });
        }
    }, [showImage]);

    const handleMousePhotoSafeZone = () => {
        gsap.to(imageRef, {
            opacity: 0,
            y: 200,
            duration: 1.5,
            ease: "power4.in"
        });
    };


    return (
        <>
            {/* Overlay animado */}
            <div ref={overlayRef} className="absolute h-screen w-screen overflow-hidden bg-black z-[8888] flex justify-center items-center">
                <div ref={listRef} className="w-[80%] flex flex-col 2xl:gap-60  lg:gap-16">
                    {/* Primera lista (Columna de 6 elementos) */}
                    <nav className="">
                        <ul className="flex mt-32 flex-col space-y-6 text-white 2xl:text-3xl lg:text-xl lg:mt-16">
                            {["Collection", "Design", "Craftmanship", "Ethics"].map((item, index) => (
                                <li key={item} className="relative parentListItem">
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="hover:text-gray-400 transition-colors lg:text-xl 2xl:text-2xl"
                                        onMouseEnter={() => index === 0 && setIsSubMenuVisible(true)}
                                        onMouseLeave={() => index === 0 && setIsSubMenuVisible(false)}
                                    >
                                        {item}
                                    </a>

                                    {index === 0 && isSubMenuVisible && (
                                        <>
                                            <div className="menu-container">
                                                <div
                                                    className="absolute w-full h-72 lg:h-20  left-[-80px]"
                                                    onMouseEnter={() => {
                                                        setIsSubMenuVisible(true);
                                                        handleMouseEnterSubMenu();
                                                    }}

                                                    onMouseLeave={() => {
                                                        handleMouseLeaveSubMenu();
                                                    }}
                                                ></div>

                                                <ul
                                                    className="absolute top-full left-0 p-4 space-y-4  mt-2 subMenu h-40 w-60 "
                                                    onMouseEnter={() => setIsSubMenuVisible(true)}
                                                    // onMouseLeave={() => setIsSubMenuVisible(false)}
                                                    onMouseLeave={handleMouseLeaveSafeZone}
                                                    onMouseMove={handleMousePhotoSafeZone}
                                                >
                                                    {["Link 1", "Link 2", "Link 3"].map((subItem, index) => (
                                                        <li
                                                            key={subItem}
                                                            className="text-sm lg:text-xs"
                                                            onMouseEnter={() => {
                                                                handleMouseEnterSubMenu(index)
                                                                handleMousePhotoSafeZone()
                                                            }} // Aquí llamas a handleMouseEnterSubMenu pasando el índice
                                                            onMouseLeave={handleMouseLeaveSubMenu}
                                                        >
                                                            <a
                                                                href={`#${subItem.toLowerCase().replace(" ", "-")}`}
                                                                className="text-gray-400 hover:text-white transition-colors"
                                                            >
                                                                {subItem}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Segunda lista (3 columnas x 2 filas) */}
                    <div className="grid grid-cols-3 gap-6 text-gray-400 text-l w-[20%] mt-24 lg:text-xs 2xl:text-base">
                        {["About", "Contact", "Dealers", "News", "Care", "Press"].map((i) => (
                            <a key={i} href={`#${i.toLowerCase()}`} className="hover:text-gray-500 transition-colors">
                                {i}
                            </a>
                        ))}
                    </div>

                </div>
            </div>

            {/* Mostrar imagen cuando el mouse está sobre el primer submenú */}
            {showImage && furnituresSlider[currentIndex] && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center flex justify-end">
                    <img
                        className="lg:max-h-[40vh] lg:object-cover lg:max-w-[40vh] "
                        ref={imageRef}
                        src={`${VITE_IMAGE_URL}${furnituresSlider[currentIndex].imagen}`}
                        alt="SubMenu Image"
                        style={{ width: '500px', height: '500px', objectFit: 'cover', top: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end flex' }} // Define el tamaño de la imagen
                    />
                </div>
            )}

            {/* Header con botón hamburguesa */}
            <div className="flex justify-center fixed top-0 left-0 w-full transition-colors duration-300" style={{ zIndex: 9999 }}>
                <div className="justify-between flex items-center w-[80%] mt-4 mb-4">
                    <div ref={textRef} className="mb-3.5 font-extrabold 2xl:text-4xl lg:text-2xl" style={{ zIndex: 9999 }}>
                        mater
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