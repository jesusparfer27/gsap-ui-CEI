import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useSliderContext } from '../context/SliderContext';

const Slider = () => {
  const { isVisible } = useSliderContext();
  const sliderRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      gsap.to(sliderRef.current, {
        x: 0,
        duration: 2,
        ease: 'power3.inOut',
      });
    } else {
      gsap.to(sliderRef.current, {
        x: '100%',
        duration: 2,
        ease: 'power3.inOut',
      });
    }
  }, [isVisible]);

  return (
    <div
      ref={sliderRef}
      className="top-0 right-0 h-screen bg-black absolute"
      style={{
        width: '100vw',
        height: '100vh',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        zIndex: 1000, // Se mantiene debajo del Header
      }}
    />
  );
};


export default Slider;
