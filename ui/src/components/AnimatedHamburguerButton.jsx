import React, { useState, forwardRef } from "react";
import { MotionConfig, motion } from "framer-motion";

const VARIANTS = {
  top: {
    open: { rotate: ["0deg", "0deg", "45deg"], top: ["30%", "50%", "50%"] },
    closed: { rotate: ["45deg", "0deg", "0deg"], top: ["50%", "50%", "30%"] },
  },
  middle: {
    open: { rotate: ["0deg", "0deg", "-45deg"] },
    closed: { rotate: ["-45deg", "0deg", "0deg"] },
  },
  bottom: {
    open: { rotate: ["0deg", "0deg", "45deg"], bottom: ["30%", "50%", "50%"], left: "50%" },
    closed: { rotate: ["45deg", "0deg", "0deg"], bottom: ["50%", "50%", "30%"], left: "calc(50% + 6px)" },
  },
};

export const AnimatedHamburgerButton = forwardRef(({ onClick, shouldChangeColorMenu, shouldChangeColor }, ref) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive((prev) => !prev);
  };

  return (
    <MotionConfig transition={{ duration: 0.5, ease: "easeInOut" }}>
      <motion.button
        ref={ref}
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={() => {
          handleClick();
          onClick();
        }}
        className={`relative h-12 w-12 border-2 transition-colors ${
          active ? "bg-transparent" : "bg-transparent"
        }`}
      >
        <motion.span
          variants={VARIANTS.top}
          className={`absolute h-0.5 w-8 ${shouldChangeColorMenu ? "bg-white" : "bg-black"}`}
          style={{ y: "-50%", left: "50%", x: "-50%", top: "30%" }}
        />
        <motion.span
          variants={VARIANTS.middle}
          className={`absolute h-0.5 w-8 ${shouldChangeColorMenu ? "bg-white" : "bg-black"}`}
          style={{ left: "50%", x: "-50%", top: "50%" }}
        />
        <motion.span
          variants={VARIANTS.bottom}
          className={`absolute h-0.5 w-4 ${shouldChangeColorMenu ? "bg-white" : "bg-black"}`}
          style={{
            x: "-50%",
            y: "50%",
            left: "50%",
          }}
        />
      </motion.button>
    </MotionConfig>
  );
}); 

