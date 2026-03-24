import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "How does CODEYE differ from traditional linters?",
    answer: "Traditional linters rely on static AST parsing and predefined rulesets. CODEYE uses advanced LLMs to understand the context, intent, and architecture of your code, catching logical bugs and security flaws that linters miss.",
  },
  {
    question: "Is my code secure? Do you train models on it?",
    answer: "Security is our top priority. We do not train our models on your proprietary code. All data is encrypted in transit and at rest, and we offer enterprise options for zero-retention policies.",
  },
  {
    question: "Which programming languages do you support?",
    answer: "We support over 20 languages including JavaScript, TypeScript, Python, Go, Rust, Java, C++, Ruby, PHP, Swift, and Kotlin. Our models are trained on vast amounts of code across all major ecosystems.",
  },
  {
    question: "Can I integrate CODEYE into my CI/CD pipeline?",
    answer: "Yes! Our Pro and Team plans include native integrations for GitHub Actions, GitLab CI, Bitbucket Pipelines, and Jenkins. You can block PRs automatically if critical vulnerabilities are detected.",
  },
  {
    question: "How fast is the analysis?",
    answer: "For typical files (under 1000 lines), analysis takes between 2-5 seconds. Our distributed architecture ensures low latency even during peak usage times.",
  },
  {
    question: "Do you offer custom rulesets for teams?",
    answer: "Yes, Team plan users can define custom architectural guidelines, naming conventions, and domain-specific rules that the AI will enforce during reviews.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

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
      itemsRef.current,
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
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={sectionRef} className="py-24 relative bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-fg">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-fg">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              ref={addToRefs}
              className="border border-border rounded-xl bg-card overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-lg pr-8 text-fg group-hover:text-muted-fg transition-colors">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 shrink-0 ${
                    openIndex === index ? "rotate-180 text-fg" : "text-muted-fg"
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="p-6 pt-0 text-muted-fg leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
