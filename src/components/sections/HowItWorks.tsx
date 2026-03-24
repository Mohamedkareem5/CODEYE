import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Cpu, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: <Code2 className="w-8 h-8 text-fg" />,
    title: "1. Paste Your Code",
    description: "Connect your repository, use our IDE plugin, or simply paste your code snippet into the CODEYE interface.",
  },
  {
    icon: <Cpu className="w-8 h-8 text-fg" />,
    title: "2. AI Analyzes It",
    description: "Our proprietary AI engine scans your code contextually, understanding intent, architecture, and potential flaws.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-fg" />,
    title: "3. Get Actionable Feedback",
    description: "Receive a structured, prioritized report with exact line numbers and copy-pasteable fix suggestions.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

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

    // Animate the connecting line
    gsap.fromTo(
      lineRef.current,
      { height: 0 },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        },
      }
    );

    // Animate steps
    stepsRef.current.forEach((step, index) => {
      gsap.fromTo(
        step,
        { x: index % 2 === 0 ? 50 : -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
          },
        }
      );
    });

    // 3D Tilt Effect
    const handleMouseMove = (e: MouseEvent, card: HTMLDivElement) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: "none"
      });
    };

    const handleMouseLeave = (card: HTMLDivElement) => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    const mouseMoveListeners = stepsRef.current.map(step => {
      if (!step) return null;
      const card = step.querySelector('.card-tilt') as HTMLDivElement;
      if (!card) return null;
      const listener = (e: MouseEvent) => handleMouseMove(e, card);
      card.addEventListener('mousemove', listener);
      card.addEventListener('mouseleave', () => handleMouseLeave(card));
      return { card, listener };
    });

    return () => {
      mouseMoveListeners.forEach(item => {
        if (item) {
          item.card.removeEventListener('mousemove', item.listener);
          item.card.removeEventListener('mouseleave', () => handleMouseLeave(item.card));
        }
      });
    };
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-fg">How It Works</h2>
          <p className="text-lg text-muted-fg">
            Three simple steps to flawless code. No complex configuration required.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto perspective-1000">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-muted -translate-x-1/2 rounded-full overflow-hidden">
            <div ref={lineRef} className="w-full bg-fg rounded-full"></div>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div 
                key={index} 
                ref={addToRefs}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse text-left md:text-right" : "text-left"
                }`}
              >
                {/* Center Icon */}
                <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-16 h-16 rounded-full bg-card border-4 border-border flex items-center justify-center z-10 shadow-lg">
                  {step.icon}
                </div>

                {/* Content */}
                <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                  <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow card-tilt">
                    <h3 className="text-2xl font-bold mb-4 text-fg">{step.title}</h3>
                    <p className="text-muted-fg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
