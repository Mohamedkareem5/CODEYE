import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/Button";
import { Play, Copy, Trash2, CheckCircle2, AlertTriangle, ShieldAlert, Zap, Loader2, Code2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C++", "Ruby", "PHP"
];

const DEFAULT_CODE = `function processUserData(users) {
  let result = [];
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    // Check if user is active
    if (user.status == 'active') {
      // Calculate age
      let birthDate = new Date(user.dob);
      let today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      
      // Add to result
      result.push({
        id: user.id,
        name: user.firstName + ' ' + user.lastName,
        age: age,
        email: user.email
      });
    }
  }
  return result;
}`;

type ReviewCategory = "bug" | "security" | "performance" | "best_practice";

interface ReviewItem {
  category: ReviewCategory;
  line?: number;
  title: string;
  description: string;
  suggestion: string;
}

export function LiveDemo() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("JavaScript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [review, setReview] = useState<ReviewItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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
      headerRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      }
    );

    gsap.fromTo(
      editorRef.current,
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      }
    );
  }, []);

  const handleReview = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setReview(null);

    try {
      const prompt = `You are an expert senior developer and code reviewer. Review the following ${language} code for bugs, security vulnerabilities, performance issues, and best practice violations.
      
Code to review:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Return a structured JSON array of review items. Each item must have:
- category: strictly one of "bug", "security", "performance", "best_practice"
- title: A short, punchy title for the issue
- description: Detailed explanation of the issue
- suggestion: How to fix it (include code snippet if applicable)
- line: The approximate line number (omit if not applicable)`;

      const { GoogleGenAI, Type } = await import("@google/genai");
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please configure it in the settings.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  description: "strictly one of 'bug', 'security', 'performance', 'best_practice'",
                },
                title: {
                  type: Type.STRING,
                  description: "A short, punchy title for the issue",
                },
                description: {
                  type: Type.STRING,
                  description: "Detailed explanation of the issue",
                },
                suggestion: {
                  type: Type.STRING,
                  description: "How to fix it (include code snippet if applicable)",
                },
                line: {
                  type: Type.NUMBER,
                  description: "The approximate line number (omit if not applicable)",
                },
              },
              required: ["category", "title", "description", "suggestion"],
            },
          },
        },
      });

      const resultText = response.text;
      
      if (resultText) {
        const parsedReview = JSON.parse(resultText) as ReviewItem[];
        setReview(parsedReview);
        
        // Animate results in
        setTimeout(() => {
          if (resultRef.current) {
            gsap.fromTo(
              resultRef.current.children,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
          }
        }, 100);
      } else {
        throw new Error("Empty response from AI");
      }
    } catch (err) {
      console.error("Review error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze code. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (!review) return;
    const text = review.map(r => `[${r.category.toUpperCase()}] ${r.title}\n${r.description}\nSuggestion: ${r.suggestion}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return <AlertTriangle className="w-5 h-5 text-fg" />;
      case 'security': return <ShieldAlert className="w-5 h-5 text-fg" />;
      case 'performance': return <Zap className="w-5 h-5 text-fg" />;
      case 'best_practice': return <CheckCircle2 className="w-5 h-5 text-fg" />;
      default: return <AlertTriangle className="w-5 h-5 text-muted-fg" />;
    }
  };

  const getCategoryColor = (category: string) => {
    return 'border-border bg-card';
  };

  const getCategoryBadge = (category: string) => {
    return 'bg-muted text-fg border-border';
  };

  return (
    <section id="demo" ref={sectionRef} className="py-24 bg-bg relative">
      <div className="container mx-auto px-4 md:px-6">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-fg">Experience the Intelligence</h2>
          <p className="text-lg text-muted-fg">
            Paste your code below and let CODEYE analyze it in real-time. Discover bugs, security flaws, and optimization opportunities instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Editor Side */}
          <div ref={editorRef} className="flex flex-col rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg">
              <div className="flex items-center gap-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-muted"></div>
                  <div className="w-3 h-3 rounded-full bg-muted"></div>
                  <div className="w-3 h-3 rounded-full bg-muted"></div>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-sm font-medium text-fg focus:outline-none cursor-pointer"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCode('')} className="h-8 text-xs hover-invert text-fg border border-transparent hover:border-fg">
                  <Trash2 className="w-3 h-3 mr-1" /> Clear
                </Button>
                <Button size="sm" onClick={handleReview} disabled={isAnalyzing || !code.trim()} className="h-8 text-xs gap-1 hover-invert bg-fg text-bg border border-fg">
                  {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  {isAnalyzing ? 'Analyzing...' : 'Review Code'}
                </Button>
              </div>
            </div>
            <div className="relative flex-grow min-h-[400px]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 w-full h-full p-4 bg-transparent font-mono text-sm text-fg resize-none focus:outline-none"
                spellCheck="false"
                placeholder="Paste your code here..."
              />
            </div>
          </div>

          {/* Results Side */}
          <div className="flex flex-col rounded-xl border border-border bg-card shadow-lg overflow-hidden min-h-[400px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-fg">
                <Code2 className="w-4 h-4 text-fg" />
                Analysis Results
              </h3>
              {review && (
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-xs hover-invert text-fg border border-transparent hover:border-fg">
                  {copied ? <CheckCircle2 className="w-3 h-3 mr-1 text-fg" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? 'Copied!' : 'Copy Review'}
                </Button>
              )}
            </div>
            
            <div className="p-4 flex-grow overflow-y-auto max-h-[600px] custom-scrollbar">
              {!isAnalyzing && !review && !error && (
                <div className="h-full flex flex-col items-center justify-center text-muted-fg text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Code2 className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Click "Review Code" to see the magic happen.</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex flex-col gap-2 p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-muted rounded-full"></div>
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                      </div>
                      <div className="h-3 bg-muted rounded w-full mt-2"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                      <div className="h-20 bg-muted rounded w-full mt-2"></div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="p-4 border border-border bg-muted text-fg rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {review && (
                <div ref={resultRef} className="space-y-4">
                  {review.map((item, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${getCategoryColor(item.category)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          <h4 className="font-semibold text-sm text-fg">{item.title}</h4>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getCategoryBadge(item.category)}`}>
                          {item.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-fg mb-3">{item.description}</p>
                      <div className="bg-bg border border-border rounded p-3 text-sm font-mono text-fg">
                        <div className="text-xs text-muted-fg mb-1 uppercase tracking-wider">Suggestion</div>
                        {item.suggestion}
                      </div>
                      {item.line && (
                        <div className="mt-2 text-xs text-muted-fg text-right">
                          Line ~{item.line}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
