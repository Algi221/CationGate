import { useState } from 'react';
import './ShinyText.css';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  pauseOnHover?: boolean;
  delay?: number;
}

const ShinyText = ({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  pauseOnHover = false,
  delay = 0
}: ShinyTextProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const gradientStyle = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    '--shiny-duration': `${speed}s`,
    '--shiny-delay': `${delay}s`,
  } as React.CSSProperties;

  if (disabled) {
    return (
      <span 
        className={className} 
        style={{ color }}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      className={`shiny-text ${isPaused ? 'paused' : ''} ${className}`}
      style={gradientStyle}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {text}
    </span>
  );
};

export default ShinyText;
