import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './fade-in-section.module.css';

interface FadeInSectionProps {
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export const FadeInSection = React.memo(({
  children,
  rootMargin = '0px',
  threshold = 0.2,
  className = ''
}: FadeInSectionProps) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isVisible) {
      setVisible(true);
      if (observerRef.current && domRef.current) {
        observerRef.current.unobserve(domRef.current);
      }
    }
  }, [isVisible]);

  useEffect(() => {
    const current = domRef.current;
    if (!current) return;

    const rafId = requestAnimationFrame(() => {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        rootMargin,
        threshold
      });
      observerRef.current.observe(current);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (observerRef.current && current) {
        observerRef.current.unobserve(current);
      }
    };
  }, [handleIntersection, rootMargin, threshold]);

  return (
    <div
      ref={domRef}
      className={`${styles.fadeInSection} ${isVisible ? styles.visible : ''} ${className}`}
      aria-hidden={!isVisible}
        >
      {children}
    </div>
  );
});

FadeInSection.displayName = 'FadeInSection';
