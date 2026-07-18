import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  textMode?: boolean;
}

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  textMode = true
}: ScrollFloatProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    if (textMode) {
      let text = '';
      if (typeof children === 'string') {
        text = children;
      } else if (Array.isArray(children)) {
        text = children.map(c => typeof c === 'string' || typeof c === 'number' ? c : '').join('');
      } else if (typeof children === 'number') {
        text = children.toString();
      }

      if (text) {
        return text.split(/(\s+)/).map((part, index) => {
          if (part.match(/\s+/)) {
            return <span key={index}>{part}</span>; 
          }
          return (
            <span key={index} style={{ display: 'inline-block' }}>
              {part.split('').map((char, charIndex) => (
                <span className="char" key={charIndex} style={{ display: 'inline-block' }}>
                  {char}
                </span>
              ))}
            </span>
          );
        });
      }
    }
    return <div className="char w-full">{children}</div>;
  }, [children, textMode]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const ctx = gsap.context(() => {
      const charElements = el.querySelectorAll('.char');
      if (charElements.length === 0) return;

      gsap.fromTo(
        charElements,
        {
          willChange: 'opacity, transform',
          opacity: 0,
          yPercent: textMode ? 120 : 30,
          scaleY: textMode ? 2.3 : 1,
          scaleX: textMode ? 0.7 : 1,
          transformOrigin: '50% 0%'
        },
        {
          duration: animationDuration,
          ease: ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: stagger,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: scrollStart,
            end: scrollEnd,
            once: true
          }
        }
      );
    }, el);

    return () => {
      try {
        ctx.revert();
      } catch (e) {
        // Safe catch for React Strict Mode / HMR unmounting issues
      }
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, textMode]);

  return (
    <div 
      ref={containerRef as any} 
      className={`scroll-float ${textMode ? 'overflow-hidden pb-2 -mb-2' : ''} ${containerClassName}`}
    >
      <div className={`scroll-float-text ${textClassName}`} style={{ display: 'inline-block', width: '100%' }}>
        {splitText}
      </div>
    </div>
  );
};

export default ScrollFloat;
