import { useCallback, useEffect } from 'react';

export function useHandleCopy(el) {
  const handleCopy = useCallback((e) => {
    let text = window.getSelection().toString();
    e.clipboardData.setData('text/plain', text);
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (el) {
      el.addEventListener('copy', handleCopy);
    };
    return () => {
      if (el) {
        el.removeEventListener('copy', handleCopy);
      }
    };
  }, [el, handleCopy]);
}