import { useState, useEffect } from 'react';

/**
 * Gerencia a tela de boot com barra de progresso.
 * Antes duplicado em luxjson.jsx e Blog.jsx.
 * @param {boolean} dataReady - quando true, finaliza o loader
 */
export default function useBootLoader(dataReady) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    let timeout;

    if (dataReady) {
      const progressTimeout = setTimeout(() => setProgress(100), 0);
      timeout = setTimeout(() => setIsLoading(false), 1200);
      return () => {
        clearTimeout(progressTimeout);
        clearTimeout(timeout);
      };
    }

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return Math.min(prev + Math.random() * 8 + 2, 95);
      });
    }, 150);

    timeout = setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [dataReady]);

  return { isLoading, progress };
}
