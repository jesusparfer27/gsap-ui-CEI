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
            // Establecer la posición inicial de cada elemento del submenú
            gsap.set(".subMenu li:first-child", { y: 40, opacity: 0, duration: 1 });
            gsap.set(".subMenu li:nth-child(2)", { y: 0, opacity: 0, duration: 1});
            gsap.set(".subMenu li:nth-child(3)", { y: -40, opacity: 0, duration: 1});
    
            // Animaciones de entrada
            gsap.to(".subMenu li", {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.1, // Retraso entre cada animación
            });
    
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

            console.log("SubMenu is now hidden"); // Aquí agregamos el console.log cuando isSubMenuVisible es false
    
        } else {
            const tl = gsap.timeline({
                onComplete: () => {
                    setIsSubMenuVisible(false); // Cambia el estado cuando termine la animación
                    console.log("SubMenu is now hidden"); // Aquí agregamos el console.log cuando isSubMenuVisible es false
                },
            });
    
            // Animaciones de salida
            gsap.to(".subMenu", {
                opacity: 0,
                y: 0,
                duration: 1.2,
                ease: "power4.in",
            });
    
            gsap.to(".subMenu li:first-child", { y: -40, opacity: 0, duration: 1 });
            gsap.to(".subMenu li:nth-child(2)", { y: 0, opacity: 0, duration: 1 });
            gsap.to(".subMenu li:nth-child(3)", { y: 40, opacity: 0, duration: 1 });
    
            gsap.to(".parentListItem:first-child", {
                marginBottom: "0px",
                duration: 1.2,
                ease: "power4.in",
            });
    
            gsap.to(".parentListItem:nth-child(n+2):nth-child(-n+4)", {
                y: 0,
                duration: 1.6,
                ease: "power4.in",
            });
    
            gsap.to(".subMenu li:last-child", {
                marginBottom: "0px",
                duration: 1.2,
                ease: "power4.in",
            });
    
            gsap.to(".subMenu li", {
                y: 0,
                opacity: 0,
                duration: 1.5,
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

useEffect(() => {
    if (imageRef.current && showImage) {
        gsap.fromTo(
            imageRef.current,
            {
                opacity: 0,
                duration: 2,
                y: 200,
                immediateRender: false // Evita que GSAP fuerce el inicio antes de animar
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
            y: 200,  // No tan lejos para que sea más fluido
            duration: 1.5,
            ease: "power4.in"
        });
    }
}, [showImage]);
    

    const handleMouseEnterSubMenu = (index) => {
        setShowImage(true);
        setCurrentIndex(index); // Establece el índice del mueble para mostrar la imagen correcta
        console.log('showImage:', true); // Verifica que el estado cambie
    };

    const handleMouseLeaveSubMenu = () => {
        setShowImage(false);
        console.log('showImage:', false); // Verifica que el estado cambie
    };


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
                                                onMouseEnter={() => {
                                                    setIsSubMenuVisible(true);  // Función para mostrar el submenú
                                                    handleMouseEnterSubMenu();  // Función adicional que quieres ejecutar
                                                }}
                                                onMouseLeave={() => {
                                                    handleMouseLeaveSubMenu();  // Función adicional que quieres ejecutar
                                                }}
                                            ></div>

                                            <ul
                                                className="absolute top-full left-0 p-4 space-y-4 mt-2 subMenu"
                                                onMouseEnter={() => setIsSubMenuVisible(true)}
                                                onMouseLeave={() => setIsSubMenuVisible(false)}
                                            >
                                                {["Link 1", "Link 2", "Link 3"].map((subItem, index) => (
                                                    <li
                                                        key={subItem}
                                                        className="text-sm"
                                                        onMouseEnter={() => handleMouseEnterSubMenu(index)} // Aquí llamas a handleMouseEnterSubMenu pasando el índice
                                                        onMouseLeave={handleMouseLeaveSubMenu} // Cuando el mouse sale, se ejecuta handleMouseLeaveSubMenu
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

            {/* Mostrar imagen cuando el mouse está sobre el primer submenú */}
            {showImage && furnituresSlider[currentIndex] && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center flex justify-end">
                    <img
                        ref={imageRef}
                        src={`${VITE_IMAGE_URL}${furnituresSlider[currentIndex].imagen}`}
                        alt="SubMenu Image"
                        style={{ width: '500px', height: '500px', objectFit: 'cover', top: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end flex'}} // Define el tamaño de la imagen
                    />
                </div>
            )}

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
