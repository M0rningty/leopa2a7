import { useState, useEffect, useRef } from 'react';

export default function useLoadingProgress(modelsLoaded) {
  const [isLoading, setIsLoading] = useState(true);
  const [isClosingLoading, setIsClosingLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingDoneRef = useRef(false);
  const modelsLoadedRef = useRef(false);

  useEffect(() => {
    modelsLoadedRef.current = modelsLoaded;
  }, [modelsLoaded]);

  useEffect(() => {
    if (loadingDoneRef.current) return;
    if (modelsLoaded && loadingProgress >= 100) {
      loadingDoneRef.current = true;
      setIsClosingLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [modelsLoaded, loadingProgress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return modelsLoadedRef.current
          ? Math.min(prev + 15, 100)
          : Math.min(prev + Math.random() * 3, 90);
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return { isLoading, isClosingLoading, loadingProgress };
}
