// src/components/EnhancedCard.jsx
import React, { useState } from 'react';
import { Card, Box, useMantineTheme } from '@mantine/core';

export function EnhancedCard({
  children,
  gradient = false,
  gradientAngle = 135,
  hover = true,
  hoverLift = true,
  shadow = 'md',
  animated = true,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === 'dark';

  const cardStyle = {
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered && hoverLift ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: isHovered
      ? `0 12px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`
      : shadow,
    background: gradient
      ? `linear-gradient(${gradientAngle}deg, ${
          isDark ? theme.colors.dark[7] : theme.colors.gray[1]
        }, ${isDark ? theme.colors.dark[8] : theme.colors.gray[0]})`
      : undefined,
  };

  return (
    <Card
      {...props}
      style={cardStyle}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
    >
      {/* Shine effect overlay */}
      {animated && (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            transition: 'left 0.5s ease',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          className={isHovered && animated ? 'card-shine' : ''}
        />
      )}

      {/* Content */}
      <Box style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </Box>

      <style>{`
        .card-shine {
          animation: shine-effect 0.5s ease-in-out;
        }

        @keyframes shine-effect {
          from {
            left: -100%;
          }
          to {
            left: 100%;
          }
        }
      `}</style>
    </Card>
  );
}

export default EnhancedCard;
