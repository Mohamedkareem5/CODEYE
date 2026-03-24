import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "../ui/Button";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLHeadingElement | HTMLParagraphElement | HTMLDivElement)[]>([]);
  const ctaRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // Canvas Animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(window.innerWidth / 10, 100);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? "rgba(255, 255, 255, 0.15)" : "rgba(136, 136, 136, 0.15)",
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - dist / 3000})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    // GSAP Animation
    gsap.fromTo(
      textRefs.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2,
      }
    );

    // Magnetic CTA Buttons
    const handleMouseMove = (e: MouseEvent, btn: HTMLButtonElement) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Check if within 80px
      const distance = Math.sqrt(x * x + y * y);
      if (distance < 80) {
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleMouseLeave = (btn: HTMLButtonElement) => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };

    const mouseMoveListeners = ctaRefs.current.map(btn => {
      if (!btn) return null;
      const listener = (e: MouseEvent) => handleMouseMove(e, btn);
      window.addEventListener('mousemove', listener);
      btn.addEventListener('mouseleave', () => handleMouseLeave(btn));
      return { btn, listener };
    });

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      mouseMoveListeners.forEach(item => {
        if (item) {
          window.removeEventListener('mousemove', item.listener);
          item.btn.removeEventListener('mouseleave', () => handleMouseLeave(item.btn));
        }
      });
    };
  }, []);

  const addToRefs = (el: any) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  const addCtaRef = (el: any) => {
    if (el && !ctaRefs.current.includes(el)) {
      ctaRefs.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-bg">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start text-left max-w-2xl">
          <div 
            ref={addToRefs}
            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-fg mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-fg mr-2 animate-pulse"></span>
            CODEYE 2.0 is now live
          </div>
          
          <h1 
            ref={addToRefs}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] text-fg"
          >
            Your Code. <br />
            <span className="text-fg">Reviewed by Intelligence.</span>
          </h1>
          
          <p 
            ref={addToRefs}
            className="text-lg md:text-xl text-muted-fg mb-8 max-w-lg leading-relaxed"
          >
            Instantly detect bugs, secure vulnerabilities, and optimize performance with our AI-powered code review engine. Ship faster, with confidence.
          </p>
          
          <div ref={addToRefs} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button ref={addCtaRef} size="lg" className="gap-2 text-base h-12 px-8 group">
              Try it Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button ref={addCtaRef} size="lg" variant="outline" className="gap-2 text-base h-12 px-8">
              <PlayCircle className="w-4 h-4" />
              See How It Works
            </Button>
          </div>
          
          <div ref={addToRefs} className="mt-10 flex items-center gap-4 text-sm text-muted-fg">
            <div className="flex -space-x-2 grayscale">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-bg"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                  alt=""
                />
              ))}
            </div>
            <p>Trusted by 10,000+ developers worldwide</p>
          </div>
        </div>
        
        <div 
          ref={addToRefs}
          className="relative hidden lg:block perspective-1000"
        >
          <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0">
            <div className="flex items-center px-4 py-3 border-b border-border bg-bg">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <div className="w-3 h-3 rounded-full bg-muted"></div>
              </div>
              <div className="mx-auto text-xs text-muted-fg font-mono">auth.ts — Codeye Review</div>
            </div>
            <div className="p-4 font-mono text-sm overflow-hidden relative">
              <pre className="text-muted-fg">
                <code>
                  <span className="text-fg">async function</span> <span className="text-fg">authenticateUser</span>(req, res) {'{\n'}
                  {'  '}const {'{'} token {'}'} = req.body;{'\n'}
                  {'  '}
                  <span className="bg-muted text-fg px-1 rounded relative group cursor-pointer">
                    if (!token) return res.send("Error");
                    <span className="absolute left-full ml-2 top-0 w-48 bg-card border border-border text-fg p-2 rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <strong className="text-fg">Security Vulnerability:</strong> Missing proper HTTP status code. Use res.status(401).
                    </span>
                  </span>{'\n'}
                  {'  \n'}
                  {'  '}try {'{\n'}
                  {'    '}const user = <span className="text-fg">await</span> jwt.verify(token, process.env.SECRET);{'\n'}
                  {'    '}
                  <span className="bg-muted text-fg px-1 rounded relative group cursor-pointer">
                    const profile = await db.query(`SELECT * FROM users WHERE id = ${"${user.id}"}`);
                    <span className="absolute left-full ml-2 top-0 w-48 bg-card border border-border text-fg p-2 rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <strong className="text-fg">SQL Injection Risk:</strong> Use parameterized queries instead of string interpolation.
                    </span>
                  </span>{'\n'}
                  {'    '}return res.json(profile);{'\n'}
                  {'  }'} catch (err) {'{\n'}
                  {'    '}console.error(err);{'\n'}
                  {'  }'}\n
                  {'}'}
                </code>
              </pre>
              
              {/* Scanning overlay effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-fg/50 shadow-[0_0_15px] shadow-fg/80 animate-[scan_3s_ease-in-out_infinite]"></div>
            </div>
          </div>
          
          {/* Floating UI elements */}
          <div className="absolute -right-6 top-1/4 bg-card border border-border rounded-lg p-3 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fg"></div>
              <span className="text-xs font-medium text-fg">2 Critical Issues</span>
            </div>
          </div>
          <div className="absolute -left-8 bottom-1/4 bg-card border border-border rounded-lg p-3 shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fg"></div>
              <span className="text-xs font-medium text-fg">+15% Performance</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(250px); }
          90% { opacity: 1; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
