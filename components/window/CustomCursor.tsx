'use client';

import { useEffect, useState } from "react"
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});

  const cursorVariants = {
    default: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.001,
        ease: 'linear'
      },
      x: cursorPosition.x,
      y: cursorPosition.y,
    },
  }

  useEffect(() => {
    const handleMousePosition = (e: MouseEvent) => {
      setCursorPosition({x: e.clientX, y: e.clientY});
    }
    window.addEventListener('mousemove', handleMousePosition);
    return () => window.removeEventListener('mousemove', handleMousePosition);
  }, []);


  return (
    <motion.img
      className='h-[2em] w-[2em] fixed z-[9999] pointer-events-none'
      src='/cursor.png'
      variants={cursorVariants}
      animate='default'
    />
  )
}
