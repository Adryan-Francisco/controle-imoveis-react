// src/hooks/useKeyboardNavigation.js
import { useEffect, useCallback } from 'react';

export function useKeyboardNavigation() {
  const handleKeyDown = useCallback((event) => {
    // ESC key to close modals
    if (event.key === 'Escape') {
      const modals = document.querySelectorAll('[data-mantine-modal]');
      if (modals.length > 0) {
        const lastModal = modals[modals.length - 1];
        const closeButton = lastModal.querySelector('[data-mantine-modal-close]');
        if (closeButton) {
          closeButton.click();
        }
      }
    }

    // Enter key on buttons
    if (event.key === 'Enter' && event.target.tagName === 'BUTTON') {
      event.target.click();
    }

    // Arrow keys for table navigation
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const table = event.target.closest('table');
      if (table) {
        event.preventDefault();
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const currentRow = event.target.closest('tr');
        const currentIndex = rows.indexOf(currentRow);
        
        if (currentIndex !== -1) {
          let nextIndex;
          if (event.key === 'ArrowDown') {
            nextIndex = Math.min(currentIndex + 1, rows.length - 1);
          } else {
            nextIndex = Math.max(currentIndex - 1, 0);
          }
          
          const nextRow = rows[nextIndex];
          const firstFocusable = nextRow.querySelector('button, [tabindex="0"]');
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

