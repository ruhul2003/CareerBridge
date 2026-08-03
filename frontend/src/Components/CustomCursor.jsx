'use client';

import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailerPosition, setTrailerPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let animFrameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPosition({ x: mouseX, y: mouseY });
      if (!isVisible) setIsVisible(true);

      // Check if mouse is hovering over interactive elements
      const target = e.target;
      const isInteractive = target && (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.cursor-pointer') ||
        target.getAttribute('role') === 'button'
      );
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Smooth trailing animation loop
    let currentX = -100;
    let currentY = -100;

    const loop = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      setTrailerPosition({ x: currentX, y: currentY });
      animFrameId = requestAnimationFrame(loop);
    };
    animFrameId = requestAnimationFrame(loop);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Smooth Trailing Circle Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full transition-transform duration-100 ease-out border ${
          isHovered
            ? 'w-12 h-12 border-indigo-500/80 bg-indigo-500/15 scale-125 backdrop-blur-[1px]'
            : isClicking
            ? 'w-8 h-8 border-cyan-400 bg-cyan-500/20 scale-90'
            : 'w-9 h-9 border-indigo-500/50 dark:border-cyan-400/50 bg-indigo-500/5 dark:bg-cyan-400/5'
        }`}
        style={{
          transform: `translate3d(${trailerPosition.x - (isHovered ? 24 : 18)}px, ${trailerPosition.y - (isHovered ? 24 : 18)}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* Inner Glowing Center Circle Dot */}
      <div
        className={`fixed top-0 left-0 rounded-full transition-all duration-75 ease-out shadow-lg ${
          isHovered
            ? 'w-3 h-3 bg-indigo-500 shadow-indigo-500/50 scale-125'
            : isClicking
            ? 'w-2 h-2 bg-cyan-400 shadow-cyan-400/80 scale-75'
            : 'w-2.5 h-2.5 bg-cyan-500 dark:bg-cyan-400 shadow-cyan-500/50'
        }`}
        style={{
          transform: `translate3d(${position.x - (isHovered ? 6 : 5)}px, ${position.y - (isHovered ? 6 : 5)}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* Ambient Radial Cursor Glow */}
      <div
        className="fixed top-0 left-0 w-64 h-64 -mt-32 -ml-32 rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none opacity-40 dark:opacity-60 transition-opacity duration-300"
        style={{
          transform: `translate3d(${trailerPosition.x}px, ${trailerPosition.y}px, 0)`,
          willChange: 'transform',
        }}
      />
    </div>
  );
}
