import React, { useEffect, useState, createContext, useContext } from 'react';

// Responsive Context for container-query based breakpoints
interface ResponsiveContextType {
  containerWidth: number;
  containerHeight: number;
  breakpoint: 'micro' | 'mobile' | 'tablet' | 'desktop' | 'wide' | 'ultra';
  prefersReducedMotion: boolean;
  prefersReducedTransparency: boolean;
  isTouch: boolean;
  isPointerFine: boolean;
}

const defaultState: ResponsiveContextType = {
  containerWidth: 1024,
  containerHeight: 768,
  breakpoint: 'desktop',
  prefersReducedMotion: false,
  prefersReducedTransparency: false,
  isTouch: false,
  isPointerFine: true,
};

const ResponsiveContext = createContext<ResponsiveContextType>(defaultState);

export const useResponsive = () => useContext(ResponsiveContext);

// Container Query Hook
export const useContainerQuery = (ref: React.RefObject<HTMLElement>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
};

// Fluid Typography Calculator
export const fluidType = (minSize: number, maxSize: number, minWidth = 320, maxWidth = 1440) => {
  const slope = (maxSize - minSize) / (maxWidth - minWidth);
  const intercept = minSize - slope * minWidth;
  return `clamp(${minSize}px, ${intercept}px + ${slope * 100}vw, ${maxSize}px)`;
};

// Fluid Spacing Calculator  
export const fluidSpace = (minSize: number, maxSize: number) => {
  return fluidType(minSize, maxSize, 320, 1440);
};

// Responsive Provider - SSR-safe
export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with safe default values (no window access)
  const [state, setState] = useState<ResponsiveContextType>(defaultState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only run on client-side after hydration
    const updateState = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const h = typeof window !== 'undefined' ? window.innerHeight : 768;
      
      let bp: ResponsiveContextType['breakpoint'] = 'desktop';

      if (w < 320) bp = 'micro';
      else if (w < 640) bp = 'mobile';
      else if (w < 1024) bp = 'tablet';
      else if (w < 1440) bp = 'desktop';
      else if (w < 1920) bp = 'wide';
      else bp = 'ultra';

      setState({
        containerWidth: w,
        containerHeight: h,
        breakpoint: bp,
        prefersReducedMotion: typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
        prefersReducedTransparency: typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-transparency: reduce)').matches : false,
        isTouch: typeof window !== 'undefined' ? ('ontouchstart' in window || navigator.maxTouchPoints > 0) : false,
        isPointerFine: typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : true,
      });
    };

    setIsMounted(true);
    updateState();
    window.addEventListener('resize', updateState);

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
      motionQuery.removeEventListener('change', updateState);
    };
  }, []);

  return (
    <ResponsiveContext.Provider value={state}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Motion-Reduced Wrapper
export const MotionSafe: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const { prefersReducedMotion } = useResponsive();

  if (prefersReducedMotion && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Touch-Optimized Wrapper
export const TouchOptimized: React.FC<{
  children: React.ReactNode;
  touchVariant?: React.ReactNode;
}> = ({ children, touchVariant }) => {
  const { isTouch } = useResponsive();

  if (isTouch && touchVariant) {
    return <>{touchVariant}</>;
  }

  return <>{children}</>;
};

export default ResponsiveContext;
