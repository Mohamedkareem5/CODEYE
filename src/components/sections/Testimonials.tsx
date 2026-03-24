import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "CODEYE caught a critical SQL injection vulnerability in a PR that three senior engineers missed. It paid for itself in the first week.",
    name: "Sarah Jenkins",
    role: "Lead Security Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    quote: "The performance suggestions are incredible. It found an O(n^2) loop hidden in our data processing pipeline and suggested the exact Map-based fix.",
    name: "David Chen",
    role: "Backend Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    quote: "As a solo founder, CODEYE is like having a staff engineer looking over my shoulder 24/7. The integration with VS Code is seamless.",
    name: "Elena Rodriguez",
    role: "Indie Hacker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
  },
];

export function Testimonials() {
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
    <section ref={sectionRef} className="py-24 bg-bg overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-fg">Loved by Developers</h2>
          <p className="text-lg text-muted-fg">
            Don't just take our word for it. See what engineering teams are saying about CODEYE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={addToRefs}
              className="bg-card p-8 rounded-2xl border border-border shadow-sm relative card-tilt"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[var(--border)]" />
              <p className="text-fg mb-8 relative z-10 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border border-border bg-muted"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-sm text-fg">{testimonial.name}</h4>
                  <p className="text-xs text-muted-fg">{testimonial.role}</p>
                </div>
              </div>
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
