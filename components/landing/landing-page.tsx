"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import {
  FileText,
  Sparkles,
  Palette,
  Download,
  Bot,
  Shield,
  Zap,
  Eye,
  ArrowRight,
  Check,
  Star,
  Terminal,
  Layers,
  History,
  Github,
  ChevronDown,
  Globe,
  Lock,
  Cpu,
  Monitor,
  Database,
  HardDrive,
  Upload,
  Trash2,
  RefreshCw,
  Linkedin,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}

function RotatingWords({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setIsAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className={cn("inline-block relative overflow-hidden", className)}>
      <span
        className={cn(
          "inline-block transition-all duration-500 ease-out",
          isAnimating
            ? "opacity-0 -translate-y-full"
            : "opacity-100 translate-y-0",
        )}
      >
        {words[index]}
      </span>
    </span>
  );
}

function AnimatedCounter({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function TemplateMini({
  name,
  accent,
  layout = "single",
  delay = 0,
}: {
  name: string;
  accent: string;
  layout?: "single" | "sidebar" | "split";
  delay?: number;
}) {
  return (
    <ScrollReveal direction="scale" delay={delay}>
      <div className="group relative">
        <div
          className={cn(
            "absolute -inset-0.5 rounded-xl opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-60",
            accent,
          )}
        />
        <div
          className={cn(
            "relative w-full aspect-[8.5/11] rounded-lg border border-border/60 bg-card p-2.5 shadow-sm",
            "transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1.5 group-hover:border-primary/30",
          )}
        >
          {layout === "single" && (
            <>
              <div className={cn("h-1.5 rounded-full mb-1.5 w-2/3", accent)} />
              <div className="h-0.5 rounded-full bg-foreground/20 w-3/4 mb-0.5" />
              <div className="h-0.5 rounded-full bg-muted-foreground/15 w-1/2 mb-2" />
              <div className="space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div
                      className={cn(
                        "h-0.5 rounded-full mb-0.5 opacity-60",
                        accent,
                        i === 1 ? "w-1/3" : i === 2 ? "w-1/4" : "w-2/5",
                      )}
                    />
                    <div className="space-y-[2px]">
                      <div className="h-[2px] rounded-full bg-muted-foreground/10 w-full" />
                      <div className="h-[2px] rounded-full bg-muted-foreground/10 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {layout === "sidebar" && (
            <div className="flex gap-1.5 h-full">
              <div className={cn("w-1/3 rounded-sm p-1", accent, "opacity-10")}>
                <div className="h-1 rounded-full bg-foreground/30 w-full mb-1" />
                <div className="h-0.5 rounded-full bg-foreground/15 w-2/3 mb-2" />
                {[1, 2].map((i) => (
                  <div key={i} className="mb-1.5">
                    <div className="h-0.5 rounded-full bg-foreground/20 w-full mb-0.5" />
                    <div className="h-[2px] rounded-full bg-foreground/8 w-full" />
                    <div className="h-[2px] rounded-full bg-foreground/8 w-3/4" />
                  </div>
                ))}
              </div>
              <div className="flex-1 space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div
                      className={cn(
                        "h-0.5 rounded-full mb-0.5 opacity-60",
                        accent,
                        i === 1 ? "w-1/3" : i === 2 ? "w-1/4" : "w-2/5",
                      )}
                    />
                    <div className="space-y-[2px]">
                      <div className="h-[2px] rounded-full bg-muted-foreground/10 w-full" />
                      <div className="h-[2px] rounded-full bg-muted-foreground/10 w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {layout === "split" && (
            <div className="flex gap-1 h-full">
              <div className="flex-1 space-y-1">
                <div className={cn("h-1 rounded-full w-3/4 mb-1", accent)} />
                <div className="h-0.5 rounded-full bg-foreground/15 w-full" />
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div
                      className={cn(
                        "h-0.5 rounded-full mb-0.5 opacity-50",
                        accent,
                        i === 1 ? "w-1/2" : "w-2/3",
                      )}
                    />
                    <div className="h-[2px] rounded-full bg-muted-foreground/10 w-full" />
                    <div className="h-[2px] rounded-full bg-muted-foreground/10 w-3/4" />
                  </div>
                ))}
              </div>
              <div className="w-px bg-border" />
              <div className="flex-1 space-y-1 pt-3">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div
                      className={cn(
                        "h-0.5 rounded-full mb-0.5 opacity-50",
                        accent,
                        i === 1 ? "w-2/5" : "w-1/3",
                      )}
                    />
                    <div className="h-[2px] rounded-full bg-muted-foreground/10 w-full" />
                    <div className="h-[2px] rounded-full bg-muted-foreground/10 w-5/6" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2 group-hover:text-foreground transition-colors font-medium">
          {name}
        </p>
      </div>
    </ScrollReveal>
  );
}

function LayoutPreview({
  name,
  description,
  structure,
  delay = 0,
}: {
  name: string;
  description: string;
  structure: "single" | "sidebar-left" | "sidebar-right" | "split";
  delay?: number;
}) {
  return (
    <ScrollReveal direction="scale" delay={delay}>
      <div className="group text-center">
        <div
          className={cn(
            "relative mx-auto w-24 aspect-[8.5/11] rounded-lg border-2 border-dashed border-border/60 p-1.5",
            "transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/5",
            "bg-gradient-to-br from-card to-muted/30",
          )}
        >
          {structure === "single" && (
            <div className="h-full rounded-sm bg-primary/8 border border-primary/15" />
          )}
          {structure === "sidebar-left" && (
            <div className="flex gap-1 h-full">
              <div className="w-1/3 rounded-sm bg-primary/15 border border-primary/20" />
              <div className="flex-1 rounded-sm bg-primary/8 border border-primary/15" />
            </div>
          )}
          {structure === "sidebar-right" && (
            <div className="flex gap-1 h-full">
              <div className="flex-1 rounded-sm bg-primary/8 border border-primary/15" />
              <div className="w-1/3 rounded-sm bg-primary/15 border border-primary/20" />
            </div>
          )}
          {structure === "split" && (
            <div className="flex gap-1 h-full">
              <div className="flex-1 rounded-sm bg-primary/10 border border-primary/15" />
              <div className="flex-1 rounded-sm bg-primary/10 border border-primary/15" />
            </div>
          )}
        </div>
        <p className="text-xs font-semibold mt-2 group-hover:text-primary transition-colors">
          {name}
        </p>
        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
          {description}
        </p>
      </div>
    </ScrollReveal>
  );
}

function WaveDivider({
  flip,
  className,
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-[0]",
        flip && "rotate-180",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
          className="fill-background"
        />
      </svg>
    </div>
  );
}

function FloatingDot({
  className,
  size = 4,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-full bg-primary/20 pointer-events-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <ScrollReveal delay={delay}>
      <div
        className={cn(
          "group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6",
          "transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
          "hover:border-primary/30",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0",
          "before:transition-opacity before:duration-500 hover:before:opacity-100",
        )}
      >
        <div className="relative">
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center mb-4",
              "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10",
              "transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10",
            )}
          >
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

function AIProviderCard({
  name,
  description,
  icon: Icon,
  badge,
  delay = 0,
}: {
  name: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  delay?: number;
}) {
  return (
    <ScrollReveal delay={delay}>
      <div
        className={cn(
          "group relative flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4",
          "transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        )}
      >
        <div
          className={cn(
            "h-11 w-11 rounded-xl shrink-0 flex items-center justify-center",
            "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10",
            "transition-transform duration-300 group-hover:scale-110",
          )}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm">{name}</span>
            {badge && (
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 h-4 shrink-0"
              >
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/30 bg-background/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-foreground tracking-tight">
                CV Generator
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-0"
              >
                FREE
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <Link href="/editor">
                <Button
                  size="sm"
                  className="gap-1.5 shadow-md shadow-primary/10"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  Open Editor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-14">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-32 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <FloatingDot className="top-[15%] left-[10%]" size={6} delay={0} />
          <FloatingDot className="top-[25%] right-[15%]" size={4} delay={1.5} />
          <FloatingDot className="top-[45%] left-[20%]" size={5} delay={3} />
          <FloatingDot className="top-[35%] right-[25%]" size={3} delay={4.5} />
          <FloatingDot className="top-[55%] left-[40%]" size={4} delay={2} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          <ScrollReveal delay={100}>
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8",
                "border border-primary/20 bg-primary/5 backdrop-blur-sm shadow-sm shadow-primary/5",
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary/80">
                AI-Powered Resume Builder
              </span>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 border-primary/20"
              >
                v1.0
              </Badge>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Build your{" "}
              <RotatingWords
                words={["perfect", "standout", "winning", "polished"]}
                className="text-primary"
              />{" "}
              CV
              <br />
              <span className="text-muted-foreground font-semibold">
                in minutes, not hours
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              <span className="text-foreground font-medium">18 templates</span>,{" "}
              <span className="text-foreground font-medium">
                4 layout structures
              </span>
              ,{" "}
              <span className="text-foreground font-medium">
                5 AI providers
              </span>{" "}
              — all running locally in your browser. No sign-up. No data
              collection.
              <br />
              <span className="text-primary font-medium">Just results.</span>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/editor">
                <Button
                  size="lg"
                  className={cn(
                    "gap-2 px-10 h-14 text-base font-semibold",
                    "shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30",
                    "transition-all duration-300 hover:scale-[1.02]",
                  )}
                >
                  <Zap className="h-4 w-4" />
                  Start Building — Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 px-8 h-14 text-base border-border/60 hover:border-primary/30 hover:bg-primary/5"
                >
                  See How It Works
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-14">
              {[
                { value: 18, suffix: "+", label: "Templates", icon: Palette },
                { value: 5, suffix: "", label: "AI Providers", icon: Bot },
                { value: 4, suffix: "", label: "Layout Modes", icon: Layers },
                { value: 0, suffix: "$", label: "Forever", icon: Sparkles },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <stat.icon className="h-3.5 w-3.5 text-primary/60" />
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stat.label === "Forever" ? (
                        <>
                          {stat.suffix}
                          <AnimatedCounter end={stat.value} />
                        </>
                      ) : (
                        <>
                          <AnimatedCounter end={stat.value} />
                          {stat.suffix}
                        </>
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground tracking-wide uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <WaveDivider className="-mb-px" />
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-muted/30 py-24 sm:py-28 scroll-mt-14"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 border-primary/20 text-primary"
              >
                How It Works
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Three steps to your <GradientText>new CV</GradientText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Simple, fast, and private — from blank page to polished resume
                in minutes.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 150}>
                <div className="relative text-center group">
                  <div
                    className={cn(
                      "text-[100px] font-black leading-none select-none absolute -top-6 left-1/2 -translate-x-1/2",
                      "bg-gradient-to-b from-primary/10 to-transparent bg-clip-text text-transparent",
                    )}
                  >
                    {i + 1}
                  </div>
                  <div className="relative pt-12">
                    <div
                      className={cn(
                        "h-16 w-16 rounded-2xl mx-auto mb-5 flex items-center justify-center",
                        "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/15",
                        "shadow-lg shadow-primary/5",
                        "transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/10",
                      )}
                    >
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:flex absolute top-[76px] -right-3 text-primary/20 items-center">
                      <div className="w-3 h-px bg-primary/20" />
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* EDITOR PREVIEW */}
      <section className="py-24 sm:py-28 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 border-primary/20 text-primary"
              >
                Live Preview
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                A powerful editor, right in your browser
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Side-by-side editing with real-time preview. Collapsible
                sections, keyboard shortcuts, and three beautiful themes.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div
              className={cn(
                "relative rounded-2xl border border-border/50 bg-card overflow-hidden",
                "shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)]",
                "ring-1 ring-border/20",
              )}
            >
              <div className="flex items-center gap-2 px-4 h-10 border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="px-6 py-1 rounded-full bg-muted/60 text-xs text-muted-foreground flex items-center gap-2">
                    <Lock className="h-2.5 w-2.5" />
                    cvgenerator.app/editor
                  </div>
                </div>
              </div>

              <div className="flex h-[420px] sm:h-[500px]">
                <div className="w-12 border-r border-border/40 bg-card/80 flex flex-col items-center py-3 gap-1.5">
                  {[
                    { icon: FileText, active: true },
                    { icon: Palette, active: false },
                    { icon: Sparkles, active: false },
                    { icon: History, active: false },
                    { icon: Database, active: false },
                    { icon: Eye, active: false },
                  ].map(({ icon: Icon, active }, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        active
                          ? "bg-primary/15 text-primary shadow-sm"
                          : "text-muted-foreground/50 hover:text-muted-foreground",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  ))}
                </div>

                <div className="flex-1 p-5 overflow-hidden">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                          <FileText className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm font-semibold">
                          Personal Information
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Full Name", value: "Sarah Johnson" },
                          { label: "Email", value: "sarah@example.com" },
                          { label: "Phone", value: "+1 (555) 123-4567" },
                          { label: "Location", value: "San Francisco, CA" },
                        ].map((field) => (
                          <div
                            key={field.label}
                            className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2"
                          >
                            <div className="text-[10px] text-muted-foreground mb-0.5 font-medium">
                              {field.label}
                            </div>
                            <div className="text-xs text-foreground/70">
                              {field.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm font-semibold">
                          Professional Summary
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1 py-0 h-3.5 ml-1"
                        >
                          AI
                        </Badge>
                      </div>
                      <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2 space-y-1">
                        <div className="h-2 rounded bg-muted-foreground/8 w-full" />
                        <div className="h-2 rounded bg-muted-foreground/8 w-[92%]" />
                        <div className="h-2 rounded bg-muted-foreground/8 w-[78%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                          <Layers className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm font-semibold">
                          Work Experience
                        </span>
                      </div>
                      <div className="rounded-lg border border-border/40 bg-muted/20 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-2.5 rounded bg-foreground/12 w-1/3" />
                          <div className="text-[9px] text-muted-foreground">
                            2020 — Present
                          </div>
                        </div>
                        <div className="h-2 rounded bg-primary/10 w-2/5" />
                        <div className="space-y-0.5">
                          <div className="h-1.5 rounded bg-muted-foreground/6 w-full" />
                          <div className="h-1.5 rounded bg-muted-foreground/6 w-[88%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block w-[42%] border-l border-border/40 bg-gradient-to-br from-muted/10 to-muted/30 p-6">
                  <div className="w-full h-full rounded-lg border border-border/50 bg-white shadow-md p-5 space-y-3">
                    <div className="text-center pb-2 border-b border-slate-100">
                      <div className="h-2.5 rounded bg-slate-800 w-2/3 mx-auto mb-1" />
                      <div className="h-1.5 rounded bg-slate-400 w-1/2 mx-auto" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 rounded bg-blue-500/25 w-1/3 font-bold" />
                      <div className="h-1 rounded bg-slate-200 w-full" />
                      <div className="h-1 rounded bg-slate-200 w-[90%]" />
                      <div className="h-1 rounded bg-slate-200 w-[75%]" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="h-1.5 rounded bg-blue-500/25 w-2/5" />
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="h-1 rounded bg-slate-300 w-3/4" />
                          <div className="h-0.5 rounded bg-slate-200 w-full" />
                          <div className="h-0.5 rounded bg-slate-200 w-[85%]" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="h-1.5 rounded bg-blue-500/25 w-1/4" />
                      <div className="flex gap-1.5 flex-wrap">
                        {["w-12", "w-14", "w-10", "w-16", "w-11"].map(
                          (w, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-3 rounded-full bg-blue-50 border border-blue-100",
                                w,
                              )}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex justify-center gap-3 mt-6">
              {[
                { name: "Console Light", color: "bg-emerald-500" },
                { name: "Console Dark", color: "bg-emerald-700" },
                { name: "Modern", color: "bg-blue-500" },
              ].map((theme) => (
                <div
                  key={theme.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/40 bg-card/60 text-[11px] text-muted-foreground"
                >
                  <div className={cn("h-2 w-2 rounded-full", theme.color)} />
                  {theme.name}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* AI PROVIDERS */}
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <WaveDivider flip className="absolute top-0 left-0 right-0" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <ScrollReveal>
                <Badge
                  variant="outline"
                  className="mb-4 border-primary/20 text-primary"
                >
                  <Bot className="h-3 w-3 mr-1" />
                  AI Integration
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Your AI, <GradientText>your rules</GradientText>
                </h2>
                <p className="text-lg text-muted-foreground mb-3 leading-relaxed">
                  Connect any AI provider to generate tailored summaries,
                  enhance bullet points, and optimize your CV for specific
                  roles.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  Run models locally with{" "}
                  <span className="text-foreground font-medium">Ollama</span>{" "}
                  for complete privacy, use cloud providers like{" "}
                  <span className="text-foreground font-medium">OpenAI</span> or{" "}
                  <span className="text-foreground font-medium">Anthropic</span>{" "}
                  for cutting-edge models, or point to any{" "}
                  <span className="text-foreground font-medium">
                    OpenAI-compatible endpoint
                  </span>
                  . Fully configurable with custom system prompts and model
                  selection.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="space-y-3">
                  {[
                    "Test connection & auto-discover available models",
                    "Custom system prompts for fine-tuned output",
                    "AI generation history with diff viewer",
                    "Works great without AI too — it's optional",
                  ].map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <div className="space-y-3">
              {AI_PROVIDERS.map((p, i) => (
                <AIProviderCard key={p.name} {...p} delay={i * 80} />
              ))}
            </div>
          </div>
        </div>

        <WaveDivider className="absolute bottom-0 left-0 right-0 -mb-px" />
      </section>

      {/* TEMPLATES & LAYOUTS */}
      <section id="templates" className="py-24 sm:py-28 scroll-mt-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <Badge
                variant="outline"
                className="mb-4 border-primary/20 text-primary"
              >
                <Palette className="h-3 w-3 mr-1" />
                Templates & Layouts
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                <AnimatedCounter end={18} /> professional templates,{" "}
                <GradientText>4 layout structures</GradientText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From classic corporate to creative portfolios — each template is
                fully customizable with color palettes, fonts, and spacing. Then
                choose a layout structure that best presents your story.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-5 max-w-4xl mx-auto mb-16">
            {TEMPLATES.map((t, i) => (
              <TemplateMini
                key={t.name}
                name={t.name}
                accent={t.accent}
                layout={t.layout}
                delay={i * 50}
              />
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mb-10">
              <h3 className="text-xl font-bold tracking-tight mb-2">
                Layout Structures
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Control how your CV is structured. Each layout works with every
                template and customization.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {LAYOUTS.map((l, i) => (
              <LayoutPreview key={l.name} {...l} delay={i * 100} />
            ))}
          </div>

          <ScrollReveal delay={300}>
            <p className="text-center text-xs text-muted-foreground mt-8">
              + upload custom templates · customize color palettes · adjust
              fonts & spacing
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative py-24 sm:py-28 overflow-hidden scroll-mt-14"
      >
        <div className="absolute inset-0 bg-muted/20" />
        <WaveDivider flip className="absolute top-0 left-0 right-0" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 border-primary/20 text-primary"
              >
                Features
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Everything you need to <GradientText>land the job</GradientText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A complete toolkit for building professional resumes — from
                AI-powered writing to pixel-perfect export.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.description}
                delay={i * 70}
              />
            ))}
          </div>
        </div>

        <WaveDivider className="absolute bottom-0 left-0 right-0 -mb-px" />
      </section>

      {/* DATA TRANSPARENCY */}
      <section className="py-24 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div
                className={cn(
                  "rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-xl shadow-primary/5",
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-sm">Storage Manager</span>
                </div>

                <div className="rounded-lg border border-border/40 bg-muted/20 p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium">Storage Usage</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      47.2 KB / ~5 MB
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                      style={{ width: "12%" }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>8 active keys</span>
                    <span>0.9% used</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {STORAGE_CATEGORIES.map((cat) => (
                    <div
                      key={cat.label}
                      className="flex items-center gap-2 rounded-md border border-border/30 bg-background/50 px-2.5 py-2"
                    >
                      <div
                        className={cn(
                          "h-6 w-6 rounded flex items-center justify-center",
                          cat.color,
                        )}
                      >
                        <cat.icon className="h-3 w-3" />
                      </div>
                      <div>
                        <div className="text-[11px] font-medium leading-tight">
                          {cat.label}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          {cat.meta}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {[
                    { icon: RefreshCw, label: "Refresh" },
                    { icon: Download, label: "Export" },
                    { icon: Upload, label: "Import" },
                  ].map((action) => (
                    <div
                      key={action.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/40 bg-background/60 text-[11px] text-muted-foreground"
                    >
                      <action.icon className="h-3 w-3" />
                      {action.label}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <div>
              <ScrollReveal>
                <Badge
                  variant="outline"
                  className="mb-4 border-primary/20 text-primary"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Full Transparency
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Your data, <GradientText>completely visible</GradientText>
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  The built-in Storage Manager gives you full visibility and
                  control over every piece of data stored by CV Generator —
                  directly in your browser.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="space-y-4">
                  {[
                    {
                      icon: Eye,
                      title: "Inspect every key",
                      description:
                        "See exactly what's stored: CV data, AI config, templates, preferences, and history — with byte-level size reporting.",
                    },
                    {
                      icon: Download,
                      title: "Export & import backups",
                      description:
                        "Download a complete JSON backup of all your data. Import it on another device or restore a previous state.",
                    },
                    {
                      icon: Trash2,
                      title: "Selective or full deletion",
                      description:
                        "Delete individual keys, batch selections, or wipe everything. You're always in control.",
                    },
                    {
                      icon: Lock,
                      title: "Nothing hidden — ever",
                      description:
                        "No cookies, no analytics, no tracking pixels. The storage manager even detects unknown keys from other sources.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-3 items-start group"
                    >
                      <div
                        className={cn(
                          "h-9 w-9 rounded-lg shrink-0 flex items-center justify-center",
                          "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10",
                          "transition-transform duration-300 group-hover:scale-110",
                        )}
                      >
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-0.5">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-card border-y border-border/30" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <Badge
                variant="outline"
                className="mb-4 border-primary/20 text-primary"
              >
                <Lock className="h-3 w-3 mr-1" />
                Privacy First
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Your data never leaves your device
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unlike other resume builders, we don&apos;t store your personal
                information on any server. Everything stays in your browser.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRIVACY_POINTS.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 90}>
                <div
                  className={cn(
                    "group rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm p-5 text-center",
                    "transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5",
                  )}
                >
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center",
                      "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10",
                      "transition-transform duration-300 group-hover:scale-110",
                    )}
                  >
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-24 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 border-primary/20 text-primary"
              >
                Comparison
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Why <GradientText>CV Generator</GradientText>?
              </h2>
              <p className="text-muted-foreground">
                See how we compare to traditional resume builders.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="rounded-2xl border border-border/50 overflow-hidden shadow-lg shadow-primary/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Feature
                    </th>
                    <th className="p-4 font-bold text-primary text-center">
                      CV Generator
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-center">
                      Others
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        "border-t border-border/30 transition-colors hover:bg-muted/30",
                        i % 2 === 0 && "bg-muted/10",
                      )}
                    >
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.us ? (
                          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.others ? (
                          <Check className="h-3.5 w-3.5 text-muted-foreground/40 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-primary/70 text-primary/70"
                />
              ))}
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Ready to build your CV?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              No registration. No credit card. No data collection. Open the
              editor and start building your professional resume right now.
            </p>
            <Link href="/editor">
              <Button
                size="lg"
                className={cn(
                  "gap-2.5 px-12 h-16 text-lg font-semibold",
                  "shadow-2xl shadow-primary/25 hover:shadow-primary/35",
                  "transition-all duration-300 hover:scale-[1.03]",
                )}
              >
                <Zap className="h-5 w-5" />
                Launch Editor — It&apos;s Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-8 flex items-center justify-center gap-2">
              <Globe className="h-3 w-3" />
              Open Source · MIT License · Made with ♥
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/30 py-8 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
              <FileText className="h-3 w-3 text-primary" />
            </div>
            <span className="font-medium">CV Generator</span>
            <span className="text-muted-foreground/30">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const STEPS = [
  {
    icon: FileText,
    title: "Fill in your details",
    description:
      "Enter your experience, education, skills, and projects. Import from LinkedIn PDF or paste existing resume text to get started fast.",
  },
  {
    icon: Sparkles,
    title: "Enhance with AI",
    description:
      "Let AI rewrite bullet points, generate summaries, and suggest improvements — using local Ollama, OpenAI, Anthropic, Groq, or your own endpoint.",
  },
  {
    icon: Download,
    title: "Export & apply",
    description:
      "Choose a template & layout, customize colors and fonts, preview in real time, and export as PDF, HTML, or Markdown — ready for submission.",
  },
];

const AI_PROVIDERS = [
  {
    name: "Ollama",
    description:
      "Run models locally on your machine — 100% private, completely free",
    icon: Cpu,
    badge: "LOCAL",
  },
  {
    name: "OpenAI",
    description: "GPT-4o, GPT-4, GPT-3.5 — cutting-edge cloud intelligence",
    icon: Zap,
    badge: "CLOUD",
  },
  {
    name: "Anthropic",
    description: "Claude 3.5 Sonnet & family — nuanced, thoughtful writing",
    icon: Bot,
    badge: "CLOUD",
  },
  {
    name: "Groq",
    description: "Blazing-fast inference — LLaMA models at lightning speed",
    icon: Zap,
    badge: "FAST",
  },
  {
    name: "Custom Endpoint",
    description:
      "Any OpenAI-compatible API — self-hosted, corporate, or experimental",
    icon: Globe,
    badge: "BYOM",
  },
];

const TEMPLATES: {
  name: string;
  accent: string;
  layout?: "single" | "sidebar" | "split";
}[] = [
  { name: "Classic", accent: "bg-blue-500", layout: "single" },
  { name: "Modern", accent: "bg-indigo-500", layout: "sidebar" },
  { name: "Minimal", accent: "bg-slate-600", layout: "single" },
  { name: "Creative", accent: "bg-pink-500", layout: "split" },
  { name: "Executive", accent: "bg-amber-600", layout: "sidebar" },
  { name: "Tech", accent: "bg-emerald-500", layout: "single" },
  { name: "Elegant", accent: "bg-purple-500", layout: "sidebar" },
  { name: "Bold", accent: "bg-red-500", layout: "split" },
  { name: "Clean", accent: "bg-sky-500", layout: "single" },
  { name: "Compact", accent: "bg-teal-500", layout: "sidebar" },
  { name: "Academic", accent: "bg-cyan-600", layout: "single" },
  { name: "Corporate", accent: "bg-zinc-600", layout: "sidebar" },
];

const LAYOUTS = [
  {
    name: "Single Column",
    description: "Traditional layout",
    structure: "single" as const,
  },
  {
    name: "Sidebar Left",
    description: "Info on left",
    structure: "sidebar-left" as const,
  },
  {
    name: "Sidebar Right",
    description: "Info on right",
    structure: "sidebar-right" as const,
  },
  { name: "Split", description: "Two columns", structure: "split" as const },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI Content Generation",
    description:
      "Connect 5 AI providers to generate tailored summaries, bullet points, and skill suggestions. Works with local & cloud models.",
  },
  {
    icon: Palette,
    title: "18+ Professional Templates",
    description:
      "Classic, modern, creative, minimal — customize colors, fonts, and spacing. Upload your own HTML templates too.",
  },
  {
    icon: Layers,
    title: "4 Layout Structures",
    description:
      "Single column, sidebar left/right, or split. Full control over how your CV sections are arranged and displayed.",
  },
  {
    icon: Eye,
    title: "Real-Time Preview",
    description:
      "See changes instantly in a side-by-side preview with resizable panels. Toggle visibility and fine-tune every detail.",
  },
  {
    icon: Download,
    title: "Multi-Format Export",
    description:
      "Export as PDF, HTML, or Markdown. Print-optimized with proper page breaks and margins for ATS-friendly submissions.",
  },
  {
    icon: Database,
    title: "Storage Manager",
    description:
      "Full transparency over all stored data. Inspect keys, export backups, import data, and delete anything — you're in control.",
  },
  {
    icon: History,
    title: "Version History & Diff",
    description:
      "Every AI generation is saved. Compare iterations side-by-side with a built-in diff viewer to pick the best version.",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Import",
    description:
      "Upload your LinkedIn PDF and let AI extract and structure your data automatically — instant CV from your profile.",
  },
  {
    icon: Terminal,
    title: "Developer Friendly",
    description:
      "Three themes (Console Light, Console Dark, Modern), keyboard shortcuts, and a terminal-inspired UI devs will love.",
  },
  {
    icon: Shield,
    title: "Privacy by Design",
    description:
      "All data stored in localStorage. No accounts, no servers, no tracking. Your resume stays on your device — always.",
  },
  {
    icon: WifiOff,
    title: "Works Offline",
    description:
      "No installation needed. Works fully offline after first load. Zero loading screens, instant startup.",
  },
  {
    icon: Globe,
    title: "Open Source",
    description:
      "Fully auditable MIT-licensed code. Fork it, customize it, self-host it. Community-driven and transparent.",
  },
];

const STORAGE_CATEGORIES = [
  {
    icon: FileText,
    label: "CV Data",
    meta: "3 keys · 12.8 KB",
    color: "bg-blue-500/15 text-blue-600",
  },
  {
    icon: Bot,
    label: "AI Config",
    meta: "2 keys · 1.2 KB",
    color: "bg-purple-500/15 text-purple-600",
  },
  {
    icon: Palette,
    label: "Templates",
    meta: "2 keys · 28.1 KB",
    color: "bg-pink-500/15 text-pink-600",
  },
  {
    icon: History,
    label: "History",
    meta: "1 key · 5.1 KB",
    color: "bg-amber-500/15 text-amber-600",
  },
];

const PRIVACY_POINTS = [
  {
    icon: Lock,
    title: "No Account Needed",
    description:
      "Start building immediately. Zero sign-up friction, zero data required.",
  },
  {
    icon: HardDrive,
    title: "Browser-Only Storage",
    description:
      "All data lives in localStorage. Never uploaded, never shared, never sold.",
  },
  {
    icon: Cpu,
    title: "Local AI Processing",
    description:
      "Run Ollama on your machine. Your data never touches an external server.",
  },
  {
    icon: Globe,
    title: "Fully Open Source",
    description:
      "Every line is auditable. MIT licensed. Fork it, inspect it, trust it.",
  },
];

const COMPARISON = [
  { feature: "Completely free", us: true, others: false },
  { feature: "No sign-up required", us: true, others: false },
  { feature: "Data stays on your device", us: true, others: false },
  { feature: "Local AI (Ollama)", us: true, others: false },
  { feature: "5 AI provider options", us: true, others: false },
  { feature: "18+ templates", us: true, others: true },
  { feature: "4 layout structures", us: true, others: false },
  { feature: "Real-time preview", us: true, others: true },
  { feature: "Version history & diff", us: true, others: false },
  { feature: "Storage transparency", us: true, others: false },
  { feature: "LinkedIn PDF import", us: true, others: true },
  { feature: "Open source (MIT)", us: true, others: false },
  { feature: "Works offline", us: true, others: false },
];
