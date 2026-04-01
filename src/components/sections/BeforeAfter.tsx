import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BEFORE_CODE = `function calc(items) {
  let t = 0;
  for(let i=0; i<items.length; i++) {
    if(items[i].active == true) {
      t += items[i].price * items[i].qty;
    }
  }
  return t;
}`;

const AFTER_CODE = `/**
 * Calculates the total price of all active items.
 * @param {Array<{active: boolean, price: number, qty: number}>} items
 * @returns {number} The total price.
 */
function calculateTotalPrice(items) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }

  return items
    .filter(item => item.active)
    .reduce((total, item) => total + (item.price * item.qty), 0);
}`;

export function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      }
    );
  }, []);

  const updateSlider = (clientX: number) => {
    if (!containerRef.current || !overlayRef.current || !sliderRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    overlayRef.current.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    sliderRef.current.style.left = `calc(${percentage}% - 2px)`;
  };

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      updateSlider(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      updateSlider(e.touches[0].clientX);
    };

    const handleUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="py-24 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-fg">See the Difference</h2>
          <p className="text-lg text-muted-fg">
            {isMobile ? "Toggle to reveal how CODEYE transforms your code" : "Drag the slider to reveal how CODEYE transforms your code"}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {isMobile && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowAfter(!showAfter)}
                className="px-6 py-2 bg-card border border-border text-fg rounded-full font-medium text-sm hover-invert"
              >
                Show {showAfter ? "Before" : "After"}
              </button>
            </div>
          )}

          <div
            ref={containerRef}
            className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden border border-border bg-card select-none"
            style={{ cursor: isMobile ? 'default' : 'ew-resize' }}
            onMouseDown={(e) => {
              if (isMobile) return;
              e.preventDefault();
              isDragging.current = true;
              updateSlider(e.clientX);
            }}
            onTouchStart={(e) => {
              if (isMobile) return;
              isDragging.current = true;
              updateSlider(e.touches[0].clientX);
            }}
          >
            {/* Before Code */}
            <div className={`absolute inset-0 w-full h-full p-6 md:p-8 ${isMobile && showAfter ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <div className="text-xs text-muted-fg uppercase tracking-widest mb-4 font-bold">Before</div>
              <pre className="font-mono text-sm md:text-base text-muted-fg overflow-x-auto">
                <code>{BEFORE_CODE}</code>
              </pre>
            </div>

            {/* After Code */}
            <div
              ref={overlayRef}
              className={`absolute inset-0 h-full bg-card p-6 md:p-8 border-r border-fg ${isMobile ? (showAfter ? 'opacity-100 w-full' : 'opacity-0 w-full') : ''} transition-opacity duration-300`}
              style={{ clipPath: isMobile ? 'none' : 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
            >
              <div className="text-xs text-fg uppercase tracking-widest mb-4 font-bold">After</div>
              <pre className="font-mono text-sm md:text-base text-fg overflow-x-auto">
                <code>{AFTER_CODE}</code>
              </pre>
            </div>

            {/* Slider Handle */}
            {!isMobile && (
              <div
                ref={sliderRef}
                className="absolute top-0 bottom-0 w-1 bg-fg z-10 pointer-events-none"
                style={{ left: 'calc(50% - 2px)' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-fg rounded-full flex items-center justify-center shadow-lg">
                  <div className="flex gap-1">
                    <div className="w-0.5 h-3 bg-bg"></div>
                    <div className="w-0.5 h-3 bg-bg"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
