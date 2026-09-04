import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollCompress Component Wrapper
 * 
 * - Increased scroll height travel (translateY 85px -> 0px).
 * - Increased landing delay & smooth 0.95s transition.
 * - Enhanced compression (scale 0.91 & translateY -40px).
 */
export default function ScrollCompress({ children, className = '', staggerDelay = 0 }) {
  const ref = useRef(null);
  const [scrollState, setScrollState] = useState('below-view'); // 'below-view' | 'in-view' | 'compressed'

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setScrollState('in-view');
          } else {
            if (entry.boundingClientRect.top < 0) {
              setScrollState('compressed');
            } else {
              setScrollState('below-view');
            }
          }
        });
      },
      {
        threshold: [0.08, 0.85],
        rootMargin: '-30px 0px -30px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const getStyle = () => {
    if (scrollState === 'in-view') {
      return {
        opacity: 1,
        transform: 'translateY(0px) scale(1)',
        transitionDelay: `${staggerDelay}s`
      };
    } else if (scrollState === 'compressed') {
      return {
        opacity: 0.65,
        transform: 'translateY(-40px) scale(0.91)',
        transitionDelay: '0s'
      };
    } else {
      // below-view
      return {
        opacity: 0,
        transform: 'translateY(85px) scale(0.90)',
        transitionDelay: '0s'
      };
    }
  };

  return (
    <div
      ref={ref}
      style={getStyle()}
      className={`scroll-compress-box scroll-timeline-compress ${className}`}
    >
      {children}
    </div>
  );
}
