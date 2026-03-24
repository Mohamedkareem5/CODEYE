import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 10000, label: "Reviews Generated", suffix: "+" },
  { value: 98, label: "Bug Detection Rate", suffix: "%" },
  { value: 40, label: "Languages Supported", suffix: "+" },
  { value: 3, label: "Average Review Time", suffix: "s" },
];

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Animate numbers
          STATS.forEach((stat, index) => {
            let startTimestamp: number | null = null;
            const duration = 2000; // 2 seconds

            const step = (timestamp: number) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
              
              // easeOutQuart
              const easeProgress = 1 - Math.pow(1 - progress, 4);
              const currentCount = Math.floor(easeProgress * stat.value);

              setCounts(prev => {
                const newCounts = [...prev];
                newCounts[index] = currentCount;
                return newCounts;
              });

              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                setCounts(prev => {
                  const newCounts = [...prev];
                  newCounts[index] = stat.value;
                  return newCounts;
                });
              }
            };
            window.requestAnimationFrame(step);
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    // GSAP fade up
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

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="w-full bg-bg py-24 border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
          {STATS.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center py-6 md:py-0 text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-fg mb-2">
                {counts[index].toLocaleString()}{stat.suffix}
              </div>
              <div className="text-sm text-muted-fg uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
