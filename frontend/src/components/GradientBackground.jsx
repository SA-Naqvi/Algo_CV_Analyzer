import React, { useEffect, useRef } from 'react';

/* global Gradient */

function GradientBackground({ height = '55vh' }) {
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);

  useEffect(() => {
    const initGradient = () => {
      if (typeof Gradient !== 'undefined' && canvasRef.current && !gradientRef.current) {
        try {
          // eslint-disable-next-line no-undef
          const gradient = new Gradient();
          gradient.initGradient('#gradient-canvas');
          gradientRef.current = gradient;
        } catch (error) {
          console.error('Error initializing gradient:', error);
        }
      }
    };

    // Check if Gradient is already available
    if (typeof Gradient !== 'undefined') {
      initGradient();
    } else {
      // Wait for script to load
      const checkGradient = setInterval(() => {
        if (typeof Gradient !== 'undefined') {
          clearInterval(checkGradient);
          initGradient();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGradient), 10000);
    }

    return () => {
      gradientRef.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        id="gradient-canvas"
        className="absolute"
        style={{
          width: '100%',
          height: height,
          zIndex: -1,
          transform: 'translateY(-40%) rotate(-12deg) scale(2)',
          '--gradient-color-1': '#ef008f',
          '--gradient-color-2': '#6ec3f4',
          '--gradient-color-3': '#7038ff',
          '--gradient-color-4': '#ffba27',
          '--gradient-speed': '0.000014'
        }}
      />
    </div>
  );
}

export default GradientBackground;

