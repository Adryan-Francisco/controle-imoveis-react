// src/components/AccessibleModal.jsx
import React, { useEffect, useRef } from 'react';
import { Modal } from '@mantine/core';

export function AccessibleModal({ 
  opened, 
  onClose, 
  title, 
  children, 
  size = 'md',
  centered = true,
  radius = 'md',
  ...props 
}) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (opened) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal when it opens
      setTimeout(() => {
        if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }
      }, 100);
    } else {
      // Restore focus when modal closes
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [opened]);

  return (
    <Modal
      ref={modalRef}
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      radius={radius}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      {...props}
    >
      {children}
    </Modal>
  );
}

