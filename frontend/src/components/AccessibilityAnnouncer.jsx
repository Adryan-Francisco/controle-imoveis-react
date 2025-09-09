// src/components/AccessibilityAnnouncer.jsx
import React, { useEffect, useRef } from 'react';

export function AccessibilityAnnouncer({ announcements }) {
  const announcerRef = useRef(null);

  useEffect(() => {
    if (announcements.length > 0 && announcerRef.current) {
      const latestAnnouncement = announcements[announcements.length - 1];
      announcerRef.current.textContent = latestAnnouncement.message;
    }
  }, [announcements]);

  return (
    <div
      ref={announcerRef}
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
    />
  );
}

// Componente para anúncios urgentes
export function UrgentAnnouncer({ announcements }) {
  const announcerRef = useRef(null);

  useEffect(() => {
    if (announcements.length > 0 && announcerRef.current) {
      const latestAnnouncement = announcements[announcements.length - 1];
      if (latestAnnouncement.priority === 'assertive') {
        announcerRef.current.textContent = latestAnnouncement.message;
      }
    }
  }, [announcements]);

  return (
    <div
      ref={announcerRef}
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
    />
  );
}
