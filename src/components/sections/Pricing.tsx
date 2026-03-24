import { useRef, useEffect } from "react";
import { Button } from "../ui/Button";
import { Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for individual developers and small side projects.",
    features: [
      "100 AI reviews per month",
      "Basic bug detection",
      "Standard response time",
      "Community support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    description: "For professional developers who need deep analysis and security.",
    features: [
      "Unlimited AI reviews",
      "Advanced security scanning",
      "Performance optimization tips",
      "Priority response time",
      "IDE integrations (VS Code, JetBrains)",
    ],
    cta: "Start 14-Day Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$39",
    period: "/mo",
    description: "For engineering teams that want to enforce standards.",
    features: [
      "Everything in Pro",
      "Custom team rulesets",
      "GitHub/GitLab PR integration",
      "Code quality analytics dashboard",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
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
        stagger: 0.15,
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
    <section id="pricing" ref={sectionRef} className="py-24 relative bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-fg">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-fg">
            Invest in code quality. Save hours of debugging and prevent costly security breaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
          {plans.map((plan, index) => (
            <div
              key={index}
              ref={addToRefs}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                plan.popular
                  ? "border-fg shadow-xl bg-card"
                  : "border-border bg-card shadow-sm"
              } transition-colors duration-300 card-tilt`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-fg text-bg px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-fg">{plan.name}</h3>
                <p className="text-muted-fg text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-fg">{plan.price}</span>
                {plan.period && <span className="text-muted-fg">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-fg">
                    <Check className="w-5 h-5 text-fg shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "default" : "outline"}
                className={`w-full h-12 text-base hover-invert ${plan.popular ? 'bg-fg text-bg border-fg' : 'bg-transparent text-fg border-border'}`}
              >
                {plan.cta}
              </Button>
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
