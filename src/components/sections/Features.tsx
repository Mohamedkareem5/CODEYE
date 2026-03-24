import { useRef, useEffect } from "react";
import { Code2, ShieldAlert, Zap, CheckCircle2, Users, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Globe className="w-6 h-6 text-fg" />,
    title: "Multi-language Support",
    description: "Analyze code in JavaScript, Python, Go, Rust, and 20+ other languages with native-level understanding.",
    className: "md:col-span-2 md:row-span-1 bg-card",
  },
  {
    icon: <Zap className="w-6 h-6 text-fg" />,
    title: "Real-time Analysis",
    description: "Get feedback in milliseconds as you type, directly in your IDE or browser.",
    className: "md:col-span-1 md:row-span-1 bg-card",
  },
  {
    icon: <ShieldAlert className="w-6 h-6 text-fg" />,
    title: "Security Scanning",
    description: "Detect OWASP Top 10 vulnerabilities, hardcoded secrets, and injection risks before they reach production.",
    className: "md:col-span-1 md:row-span-2 bg-card",
  },
  {
    icon: <Code2 className="w-6 h-6 text-fg" />,
    title: "Performance Insights",
    description: "Identify memory leaks, O(n^2) loops, and unoptimized database queries automatically.",
    className: "md:col-span-1 md:row-span-1 bg-card",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-fg" />,
    title: "Best Practices",
    description: "Enforce clean code principles, SOLID design, and language-specific idioms across your team.",
    className: "md:col-span-1 md:row-span-1 bg-card",
  },
  {
    icon: <Users className="w-6 h-6 text-fg" />,
    title: "Team Collaboration",
    description: "Share review contexts, establish team-wide rules, and track code quality metrics over time.",
    className: "md:col-span-2 md:row-span-1 bg-card",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

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

    gsap.fromTo(
      cardsRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      }
    );

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

    const mouseMoveListeners = cardsRef.current.map(card => {
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
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section id="features" ref={sectionRef} className="py-24 relative overflow-hidden bg-bg">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-fg">Everything You Need to Ship Better Code</h2>
          <p className="text-lg text-muted-fg">
            CODEYE combines static analysis with advanced LLM reasoning to catch what traditional linters miss.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 max-w-5xl mx-auto perspective-1000">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={addToRefs}
              className={`group p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-colors duration-300 card-tilt ${feature.className}`}
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-fg">{feature.title}</h3>
              <p className="text-muted-fg leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
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
