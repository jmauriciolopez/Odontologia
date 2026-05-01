import { useEffect, RefObject } from 'react';

/**
 * Reusable hook to trap focus within a container.
 * Useful for modals, dialogs, and flyouts.
 */
export const useFocusTrap = (
  containerRef: RefObject<HTMLElement>,
  isActive: boolean,
  onClose?: () => void
) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onClose) {
        onClose();
        return;
      }

      // Handle Tab key for focus trapping
      if (e.key === 'Tab') {
        const focusableElements = containerRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Proactively focus the first element when active
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef, onClose]);
};
