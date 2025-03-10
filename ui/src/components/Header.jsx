import React from 'react';
import { AnimatedHamburgerButton } from './AnimatedHamburguerButton';
import { useSliderContext } from '../context/SliderContext';

export const Header = () => {
  const { toggleSlider } = useSliderContext();

  return (
    <div className="flex justify-center relative">
      <div className="justify-between flex items-center w-[90%] mt-4 mb-4">
        <div className="mb-3.5 text-black">
          master
        </div>
        <div>
          <AnimatedHamburgerButton onClick={toggleSlider} />
        </div>
      </div>
    </div>
  );
};
