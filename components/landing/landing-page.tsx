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
  AlertTriangle,
  Clock,
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

  // Find the longest word to reserve fixed width
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");

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
    <span
      className={cn("inline-flex justify-center relative", className)}
      style={{ minWidth: "fit-content" }}
    >
      {/* Invisible spacer for stable width */}
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {longestWord}
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center whitespace-nowrap transition-all duration-500 ease-out",
          isAnimating
            ? "opacity-0 -translate-y-[30%] scale-95"
            : "opacity-100 translate-y-0 scale-100",
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

function EditorPreviewWithThemes() {
  const [selectedTheme, setSelectedTheme] = useState("modern");

  // Real theme definitions based on actual editor oklch colors
  const themeStyles = {
    light: {
      name: "Console Light",
      bg: "bg-[#f8f6f1]", // oklch(0.96 0.01 85) - warm light
      sidebar: "bg-[#efeae3]", // slightly darker
      accent: "#2d5a49", // oklch(0.35 0.12 142) - emerald
      accentLight: "#e8f5f1",
      text: "#1a1a1a",
      grid: "border-[#e0d9d0]",
      preview: "#e8f5f1",
    },
    dark: {
      name: "Console Dark",
      bg: "#0a0e14", // ultra-dark terminal black
      sidebar: "#0d1117", // slightly lighter for depth
      accent: "#00ff41", // neon green (classic terminal)
      accentLight: "#00ff41", // same bright neon for consistency
      text: "#e8e8e8", // light gray for readability
      grid: "#1a1f2b", // subtle grid lines
      preview: "linear-gradient(135deg, #0a0e14 0%, #0d1117 100%)",
    },
    modern: {
      name: "Modern",
      bg: "#ffffff", // oklch(0.985 0.002 265) - pure white
      sidebar: "#f5f5f5",
      accent: "#4a7adb", // oklch(0.55 0.18 260) - blue
      accentLight: "#f0f4fc",
      text: "#1a1a1a",
      grid: "#e8e8e8",
      preview: "#f5f7fc",
    },
  };

  return (
    <>
      <InteractiveEditorPreview selectedTheme={selectedTheme} />
      <ScrollReveal delay={400}>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          {Object.entries(themeStyles).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setSelectedTheme(key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-300",
                "hover:scale-105 cursor-pointer",
                selectedTheme === key
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-lg"
                  : "border-border/40 bg-card/60 text-muted-foreground hover:border-primary/30",
              )}
            >
              {/* Theme preview swatch */}
              <div className="flex items-center gap-1.5">
                <div
                  className="h-3 w-3 rounded-sm border border-border/50"
                  style={{
                    backgroundColor: t.bg.startsWith("linear")
                      ? "#1a1a1a"
                      : t.bg,
                  }}
                />
                <div
                  className="h-3 w-3 rounded-sm border border-border/50"
                  style={{ backgroundColor: t.accent }}
                />
                <div
                  className="h-3 w-3 rounded-sm border border-border/50"
                  style={{ backgroundColor: t.accentLight }}
                />
              </div>
              <span className="text-sm font-medium">{t.name}</span>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Three distinct editor environments. Same powerful tool.
        </p>
      </ScrollReveal>
    </>
  );
}

function InteractiveEditorPreview({
  selectedTheme = "modern",
}: {
  selectedTheme?: string;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "personal",
  );
  const [activeTab, setActiveTab] = useState(0);
  const [highlightSection, setHighlightSection] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);

  // Real theme definitions based on oklch colors from globals.css
  const themeEnvironments = {
    light: {
      container: "bg-[#f8f6f1]", // Light warm background
      border: "border-[#e0d9d0]",
      sidebar: "bg-[#efeae3]",
      sidebarText: "text-[#2d5a49]",
      accentBg: "bg-[#e8f5f1]",
      accentText: "text-[#2d5a49]",
      accentBorder: "border-[#a8d5c4]",
      previewBg: "bg-white",
    },
    dark: {
      container: "bg-[#1a1a1a]", // Deep black
      border: "border-[#2a2a2a]",
      sidebar: "bg-[#0f0f0f]",
      sidebarText: "text-[#76dd9e]",
      accentBg: "bg-[#1a3d2e]",
      accentText: "text-[#76dd9e]",
      accentBorder: "border-[#2d7a63]",
      previewBg: "bg-[#1a1a1a]",
    },
    modern: {
      container: "bg-white", // Clean white
      border: "border-[#e8e8e8]",
      sidebar: "bg-[#f5f5f5]",
      sidebarText: "text-[#4a7adb]",
      accentBg: "bg-[#f0f4fc]",
      accentText: "text-[#4a7adb]",
      accentBorder: "border-[#a8c5f0]",
      previewBg: "bg-white",
    },
  };

  const env =
    themeEnvironments[selectedTheme as keyof typeof themeEnvironments] ||
    themeEnvironments.modern;

  useEffect(() => {
    // Animación inicial de pulso para indicar interactividad
    const timer = setTimeout(() => {
      setHighlightSection("personal");
      setTimeout(() => setHighlightSection(null), 2000);
    }, 500);

    // Ocultar hint después de 4 segundos
    const hintTimer = setTimeout(() => setShowHint(false), 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hintTimer);
    };
  }, []);

  // Mostrar hint cuando cambia de tab
  useEffect(() => {
    setShowHint(true);
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const sections = [
    {
      id: "personal",
      icon: FileText,
      title: "Personal Information",
      fields: [
        { label: "Full Name", value: "Sarah Johnson" },
        { label: "Email", value: "sarah@example.com" },
        { label: "Phone", value: "+1 (555) 123-4567" },
        { label: "Location", value: "San Francisco, CA" },
      ],
    },
    {
      id: "summary",
      icon: Sparkles,
      title: "Professional Summary",
      badge: "AI",
    },
    {
      id: "experience",
      icon: Layers,
      title: "Work Experience",
    },
  ];

  const tabs = [
    { icon: FileText, active: true, label: "Content" },
    { icon: Palette, active: false, label: "Design" },
    { icon: Sparkles, active: false, label: "AI" },
    { icon: History, active: false, label: "History" },
    { icon: Database, active: false, label: "Storage" },
    { icon: Eye, active: false, label: "Preview" },
  ];

  return (
    <div
      className={cn(
        "relative rounded-2xl border overflow-hidden transition-all duration-500",
        "shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)]",
        "ring-1 ring-border/20",
        env.container,
        env.border,
      )}
    >
      {/* Browser chrome */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 h-10 border-b transition-all duration-500",
          env.border,
        )}
        style={{
          backgroundColor:
            Object.values(themeEnvironments)[
              Object.keys(themeEnvironments).indexOf(
                selectedTheme || "modern",
              ) || (0 as any)
            ]?.sidebar,
        }}
      >
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

      {/* Interactive hint */}
      {showHint && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div
            className={cn(
              "px-4 py-2 rounded-full bg-primary/95 text-primary-foreground text-xs font-medium shadow-lg",
              "flex items-center gap-2",
              "animate-bounce",
            )}
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
            </div>
            {activeTab === 0 && "Click sections to expand/collapse"}
            {activeTab === 1 && "Select a template or color palette"}
            {activeTab === 2 && "Configure your AI provider"}
            {activeTab === 3 && "View version history"}
            {activeTab === 4 && "Manage your browser storage"}
            {activeTab === 5 && "Full preview mode"}
            <ChevronDown className="h-3 w-3 animate-pulse" />
          </div>
        </div>
      )}

      <div className="flex h-[420px] sm:h-[500px]">
        {/* Sidebar */}
        <div
          className={cn(
            "w-12 border-r flex flex-col items-center py-3 gap-1.5 transition-all duration-500",
            env.border,
          )}
          style={{
            backgroundColor: env.sidebar.startsWith("#")
              ? env.sidebar
              : undefined,
          }}
        >
          {tabs.map(({ icon: Icon, active }, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveTab(i);
                setShowHint(false);
              }}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                "hover:scale-110 cursor-pointer",
                activeTab === i
                  ? cn(env.accentBg, env.accentText, "shadow-sm")
                  : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/20",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        {/* Editor panel */}
        <div className="flex-1 p-5 overflow-hidden">
          {/* TAB 0: Content */}
          {activeTab === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
              {sections.map((section) => {
                const isExpanded = expandedSection === section.id;
                const isHighlighted = highlightSection === section.id;
                const Icon = section.icon;

                return (
                  <div key={section.id} className="relative">
                    {isHighlighted && (
                      <div className="absolute -inset-2 bg-primary/5 rounded-xl animate-pulse pointer-events-none" />
                    )}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setExpandedSection(isExpanded ? null : section.id);
                          setShowHint(false);
                        }}
                        onMouseEnter={() => setHighlightSection(section.id)}
                        onMouseLeave={() => setHighlightSection(null)}
                        className={cn(
                          "w-full flex items-center gap-2 mb-3 group cursor-pointer",
                          "transition-all duration-300 rounded-lg p-2 -mx-2",
                          "hover:bg-primary/5",
                          isExpanded && "bg-primary/5",
                        )}
                      >
                        <div
                          className={cn(
                            "h-6 w-6 rounded-md flex items-center justify-center transition-all duration-300",
                            "bg-primary/10 group-hover:bg-primary/15 group-hover:scale-110",
                            isExpanded && "bg-primary/15 scale-110",
                          )}
                        >
                          <Icon className="h-3 w-3 text-primary" />
                        </div>
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            "group-hover:text-primary",
                            isExpanded && "text-primary",
                          )}
                        >
                          {section.title}
                        </span>
                        {section.badge && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1 py-0 h-3.5 ml-1"
                          >
                            {section.badge}
                          </Badge>
                        )}
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 text-muted-foreground ml-auto transition-transform duration-300",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>

                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-500 ease-in-out",
                          isExpanded
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0",
                        )}
                      >
                        {section.id === "personal" && (
                          <div className="grid grid-cols-2 gap-2 pb-2">
                            {section.fields?.map((field, i) => (
                              <div
                                key={field.label}
                                className={cn(
                                  "rounded-lg border border-border/40 bg-muted/20 px-3 py-2",
                                  "hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-pointer",
                                  "transform hover:scale-[1.02]",
                                )}
                                style={{
                                  animation: isExpanded
                                    ? `slideIn 0.3s ease-out ${i * 0.05}s backwards`
                                    : undefined,
                                }}
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
                        )}

                        {section.id === "summary" && (
                          <div className="pb-2 space-y-2">
                            <div
                              className={cn(
                                "rounded-lg border border-border/40 bg-muted/20 px-3 py-2 space-y-1",
                                "hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-pointer",
                              )}
                            >
                              <div className="h-2 rounded bg-muted-foreground/8 w-full animate-pulse" />
                              <div
                                className="h-2 rounded bg-muted-foreground/8 w-[92%] animate-pulse"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="h-2 rounded bg-muted-foreground/8 w-[78%] animate-pulse"
                                style={{ animationDelay: "0.2s" }}
                              />
                            </div>
                            <button
                              className={cn(
                                "w-full px-3 py-2 rounded-lg border border-primary/30 bg-primary/5",
                                "text-xs font-medium text-primary",
                                "hover:bg-primary/10 transition-colors duration-200",
                                "flex items-center justify-center gap-2",
                              )}
                            >
                              <Sparkles className="h-3 w-3" />
                              Regenerate with AI
                            </button>
                          </div>
                        )}

                        {section.id === "experience" && (
                          <div
                            className={cn(
                              "rounded-lg border border-border/40 bg-muted/20 p-3 space-y-2 mb-2",
                              "hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-pointer",
                            )}
                          >
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
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 1: Design */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Template</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Classic", "Modern", "Minimal"].map((name, i) => (
                    <div
                      key={name}
                      className={cn(
                        "aspect-[8.5/11] rounded-lg border-2 transition-all duration-300 cursor-pointer",
                        i === 1
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-primary/30",
                      )}
                    >
                      <div className="p-2 space-y-1">
                        <div className="h-1 rounded bg-muted-foreground/20 w-2/3" />
                        <div className="h-0.5 rounded bg-muted-foreground/10 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Color Palette</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "bg-blue-500",
                    "bg-emerald-500",
                    "bg-purple-500",
                    "bg-amber-500",
                  ].map((color, i) => (
                    <button
                      key={i}
                      className={cn(
                        "aspect-square rounded-lg border-2 transition-all duration-300",
                        color,
                        i === 0
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105",
                      )}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Typography</span>
                </div>
                <div className="space-y-2">
                  {["Inter", "Geist", "Roboto"].map((font, i) => (
                    <div
                      key={font}
                      className={cn(
                        "px-3 py-2 rounded-lg border transition-all duration-300 cursor-pointer",
                        i === 0
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-primary/30",
                      )}
                    >
                      <span className="text-xs font-medium">{font}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Config */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">AI Provider</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Connected
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Ollama", badge: "LOCAL", icon: Cpu },
                  { name: "OpenAI", badge: "CLOUD", icon: Zap },
                  { name: "Anthropic", badge: "CLOUD", icon: Bot },
                ].map((provider, i) => {
                  const Icon = provider.icon;
                  return (
                    <button
                      key={provider.name}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300",
                        i === 0
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-primary/30",
                      )}
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-xs font-semibold">
                          {provider.name}
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[8px] px-1 py-0 h-3 mt-0.5"
                        >
                          {provider.badge}
                        </Badge>
                      </div>
                      {i === 0 && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Model
                  </span>
                </div>
                <div className="px-3 py-2 rounded-lg border border-border/40 bg-muted/20">
                  <span className="text-xs font-mono">llama3.2:3b</span>
                </div>
              </div>

              <button
                className={cn(
                  "w-full px-3 py-2 rounded-lg border border-primary/30 bg-primary/5",
                  "text-xs font-medium text-primary",
                  "hover:bg-primary/10 transition-colors duration-200",
                  "flex items-center justify-center gap-2",
                )}
              >
                <RefreshCw className="h-3 w-3" />
                Test Connection
              </button>
            </div>
          )}

          {/* TAB 3: History */}
          {activeTab === 3 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-2 mb-3">
                <History className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Version History</span>
              </div>
              {[
                { time: "2 min ago", action: "AI: Updated summary" },
                { time: "15 min ago", action: "Added experience" },
                { time: "1 hour ago", action: "Changed template" },
              ].map((entry, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2 px-3 py-2 rounded-lg transition-all duration-300",
                    "border border-border/40 hover:border-primary/30 hover:bg-primary/5 cursor-pointer",
                  )}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium">{entry.action}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {entry.time}
                    </div>
                  </div>
                  {i === 0 && (
                    <Badge
                      variant="secondary"
                      className="text-[8px] px-1 py-0 h-3"
                    >
                      CURRENT
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Storage */}
          {activeTab === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Storage Manager</span>
              </div>

              <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Usage</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    47.2 KB / 5 MB
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                    style={{ width: "12%" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "CV Data", size: "12.8 KB", icon: FileText },
                  { label: "AI Config", size: "1.2 KB", icon: Bot },
                  { label: "Templates", size: "28.1 KB", icon: Palette },
                  { label: "History", size: "5.1 KB", icon: History },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border/30 bg-background/50"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium truncate">
                          {item.label}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          {item.size}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-2 py-1.5 rounded-md border border-border/40 text-[10px] font-medium hover:bg-muted/20">
                  Export
                </button>
                <button className="flex-1 px-2 py-1.5 rounded-md border border-border/40 text-[10px] font-medium hover:bg-muted/20">
                  Import
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Preview Only */}
          {activeTab === 5 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <Eye className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Full preview mode
                </p>
                <p className="text-[10px] text-muted-foreground/70">
                  See complete CV on the right →
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Preview panel */}
        <div
          className={cn(
            "hidden sm:block w-[42%] border-l p-6 transition-all duration-500",
            env.border,
          )}
          style={{
            backgroundColor: env.sidebar.startsWith("#")
              ? env.sidebar
              : undefined,
          }}
        >
          <div
            className={cn(
              "w-full h-full rounded-lg border shadow-md p-5 space-y-3 overflow-y-auto transition-all duration-500",
              env.border,
            )}
            style={{ backgroundColor: env.previewBg }}
          >
            <div
              className={cn(
                "text-center pb-2 transition-all duration-500",
                expandedSection === "personal" && "scale-105",
                env.border,
              )}
              style={{
                borderBottomColor:
                  expandedSection === "personal"
                    ? env.accentText.replace("text-", "#")
                    : env.border.replace("border-[", "#").replace("]", ""),
              }}
            >
              <div
                className="h-2.5 rounded w-2/3 mx-auto mb-1"
                style={{
                  backgroundColor:
                    selectedTheme === "dark"
                      ? "#e8e8e8"
                      : selectedTheme === "light"
                        ? "#1a1a1a"
                        : "#1a1a1a",
                }}
              />
              <div
                className="h-1.5 rounded w-1/2 mx-auto"
                style={{
                  backgroundColor:
                    selectedTheme === "dark" ? "#888888" : "#a0a0a0",
                }}
              />
            </div>
            <div
              className={cn(
                "space-y-2 transition-all duration-500",
                expandedSection === "summary" &&
                  "ring-2 ring-offset-2 rounded-lg p-2 -m-2",
              )}
              style={{
                boxShadow:
                  expandedSection === "summary"
                    ? `0 0 0 2px ${env.accentBorder.replace("border-[", "#").replace("]", "")}, 0 0 0 4px ${env.container}`
                    : undefined,
              }}
            >
              <div
                className="h-1.5 rounded w-1/3 font-bold"
                style={{
                  backgroundColor: env.accentBg.includes("#")
                    ? env.accentBg
                    : selectedTheme === "light"
                      ? "#d5ead5"
                      : selectedTheme === "dark"
                        ? "#1a3d2e"
                        : "#f0f4fc",
                }}
              />
              <div
                className="h-1 rounded w-full"
                style={{
                  backgroundColor:
                    selectedTheme === "dark" ? "#3a3a3a" : "#d0d0d0",
                }}
              />
              <div
                className="h-1 rounded w-[90%]"
                style={{
                  backgroundColor:
                    selectedTheme === "dark" ? "#3a3a3a" : "#d0d0d0",
                }}
              />
              <div
                className="h-1 rounded w-[75%]"
                style={{
                  backgroundColor:
                    selectedTheme === "dark" ? "#3a3a3a" : "#d0d0d0",
                }}
              />
            </div>
            <div
              className={cn(
                "space-y-2 pt-1 transition-all duration-500",
                expandedSection === "experience" &&
                  "ring-2 ring-offset-2 rounded-lg p-2 -m-2",
              )}
              style={{
                boxShadow:
                  expandedSection === "experience"
                    ? `0 0 0 2px ${env.accentBorder.replace("border-[", "#").replace("]", "")}, 0 0 0 4px ${env.container}`
                    : undefined,
              }}
            >
              <div
                className="h-1.5 rounded w-2/5"
                style={{
                  backgroundColor: env.accentBg.includes("#")
                    ? env.accentBg
                    : selectedTheme === "light"
                      ? "#d5ead5"
                      : selectedTheme === "dark"
                        ? "#1a3d2e"
                        : "#f0f4fc",
                }}
              />
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <div
                    className="h-1 rounded w-3/4"
                    style={{
                      backgroundColor:
                        selectedTheme === "dark" ? "#555555" : "#c0c0c0",
                    }}
                  />
                  <div
                    className="h-0.5 rounded w-full"
                    style={{
                      backgroundColor:
                        selectedTheme === "dark" ? "#3a3a3a" : "#d0d0d0",
                    }}
                  />
                  <div
                    className="h-0.5 rounded w-[85%]"
                    style={{
                      backgroundColor:
                        selectedTheme === "dark" ? "#3a3a3a" : "#d0d0d0",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <div
                className="h-1.5 rounded w-1/4"
                style={{
                  backgroundColor: env.accentBg.includes("#")
                    ? env.accentBg
                    : selectedTheme === "light"
                      ? "#d5ead5"
                      : selectedTheme === "dark"
                        ? "#1a3d2e"
                        : "#f0f4fc",
                }}
              />
              <div className="flex gap-1.5 flex-wrap">
                {["w-12", "w-14", "w-10", "w-16", "w-11"].map((w, i) => (
                  <div
                    key={i}
                    className={cn("h-3 rounded-full border", w)}
                    style={{
                      backgroundColor:
                        selectedTheme === "light"
                          ? "#d5ead5"
                          : selectedTheme === "dark"
                            ? "#1a3d2e"
                            : "#f0f4fc",
                      borderColor:
                        selectedTheme === "light"
                          ? "#a8d5c4"
                          : selectedTheme === "dark"
                            ? "#2d7a63"
                            : "#a8c5f0",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes clickPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(var(--primary-rgb), 0);
          }
        }
        @keyframes parallax {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(20px);
          }
        }
        @keyframes glow {
          0%,
          100% {
            opacity: 0.5;
            filter: blur(8px);
          }
          50% {
            opacity: 0.8;
            filter: blur(12px);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
                href="https://github.com/destbreso/cv-generator"
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
          {/* <ScrollReveal delay={100}>
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
          </ScrollReveal> */}

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
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              Maintain one complete record of your career. Generate tailored CVs
              for every opportunity. All in your browser. No sign-up, no data
              collection.
            </p>
            <p className="text-base text-primary font-medium mb-12">
              Stop duplicating. Start generating.
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
                { value: 8, suffix: "", label: "AI Providers", icon: Bot },
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

      {/* THE PROBLEM */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none"
          style={{ animation: "glow 8s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"
          style={{ animation: "glow 10s ease-in-out infinite 2s" }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/5"
              >
                The Problem
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                We've been thinking about CVs{" "}
                <span className="text-amber-600 dark:text-amber-500">
                  all wrong
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A Word doc here, a Google Doc there, a LinkedIn profile that’s
                slightly different, a PDF you emailed last year. Every time you
                need a CV, you copy-paste, reformat, and lose track of what’s
                current.
                <br />
                <span className="font-medium text-foreground">
                  The problem isn’t writing a CV. It’s that you don’t have a
                  single source of truth.
                </span>
              </p>
            </div>
          </ScrollReveal>

          {/* Two-column layout: Concept + Practical Issues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left: The Conceptual Problem */}
            <ScrollReveal delay={100}>
              <div
                className={cn(
                  "rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8",
                  "backdrop-blur-sm shadow-xl shadow-primary/5",
                )}
              >
                <div className="flex items-start gap-3 mb-4">
                  <Database className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      Your career is one dataset
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Your experience, skills, education — it doesn’t change
                      depending on where you apply. What changes is which parts
                      you highlight. Maintain one record, generate tailored
                      views.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pl-9 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Source data stays intact
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Only the generated output changes
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Tailored for each opportunity from one source of truth
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: The Commercial Problem */}
            <ScrollReveal delay={200}>
              <div className="space-y-4">
                {[
                  {
                    icon: Lock,
                    title: "No Paywalls",
                    description:
                      "Download your own CV without a subscription. No premium features, no upsells.",
                  },
                  {
                    icon: Shield,
                    title: "100% Private",
                    description:
                      "Your data never leaves your device. Zero server tracking, zero data selling.",
                  },
                  {
                    icon: Palette,
                    title: "Full Creative Control",
                    description:
                      "13 languages, 3 themes, unlimited templates. Customize everything.",
                  },
                  {
                    icon: Globe,
                    title: "Open Source & Free Forever",
                    description:
                      "MIT licensed. Built for the community, not a VC-funded business model.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <ScrollReveal delay={250} key={item.title}>
                      <div
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/30",
                          "transition-all duration-300 hover:border-primary/30 hover:bg-primary/5",
                        )}
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* How it works */}
          <ScrollReveal delay={400}>
            <div className="bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl border border-primary/10 p-6 sm:p-8">
              <h3 className="font-bold text-lg mb-4 text-center">
                Instead of endless editing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    num: "1",
                    title: "Maintain",
                    desc: "One structured record of your experience",
                  },
                  {
                    num: "2",
                    title: "Paste",
                    desc: "A job description when applying",
                  },
                  {
                    num: "3",
                    title: "Generate",
                    desc: "A tailored CV in seconds",
                  },
                ].map((step) => (
                  <div key={step.num} className="text-center">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-3">
                      {step.num}
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
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
      <section className="py-24 sm:py-28 relative overflow-hidden bg-gradient-to-b from-background via-muted/5 to-background">
        {/* Animated accent elements */}
        <div
          className="absolute top-0 right-1/3 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"
          style={{ animation: "glow 12s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"
          style={{ animation: "glow 14s ease-in-out infinite 3s" }}
        />

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
            <div style={{ animation: "fadeInUp 0.8s ease-out" }}>
              <EditorPreviewWithThemes />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* POWERFUL EDITOR + OPTIONAL AI */}
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 -translate-x-1/2 top-16 w-[600px] h-[400px] bg-gradient-to-b from-accent/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 border-primary/20 text-primary inline-flex items-center gap-2"
              >
                <Zap className="h-3.5 w-3.5" />
                Complete Control
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Powerful Editor. <GradientText>Optional AI</GradientText>.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                AI can draft, suggest, and optimize — but you always have the
                final word. Or skip it entirely. The editor stands on its own.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left: Editor Power */}
            <div className="space-y-6">
              <ScrollReveal delay={100}>
                <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur p-6 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Full Manual Control
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Manually edit, refine, and polish your resume with
                        intuitive controls. Every section editable, every word
                        yours.
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          Real-time preview
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          18 templates × 4 layouts × ∞ palettes
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          Multiple layout options
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur p-6 hover:border-accent/30 transition-colors">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Cpu className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Import & Structure
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Import your LinkedIn PDF or any existing resume. Our
                        parser automatically extracts and organizes your
                        information.
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-blue-600" />
                          PDF auto-parsing
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-blue-600" />
                          Smart data extraction
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-blue-600" />
                          Ready to customize
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Optional AI */}
            <div className="space-y-6">
              <ScrollReveal delay={150}>
                <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur p-6 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Optional AI Refinement
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        If you want AI help, connect any of 8 providers (Ollama,
                        OpenAI, Anthropic, Gemini, Mistral, DeepSeek, Groq, or
                        custom). Completely optional.
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-purple-600" />8
                          provider choices
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-purple-600" />
                          No account needed
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-purple-600" />
                          You stay in control
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <div className="relative rounded-lg border border-border/50 bg-card/50 backdrop-blur p-6 hover:border-green-500/30 transition-colors">
                  <Badge variant="outline" className="absolute top-3 right-3 text-[10px] px-1.5 py-0.5 border-amber-500/50 text-amber-500 bg-amber-500/10">
                    WIP
                  </Badge>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <History className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Version History & Diff
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Every AI generation is saved. Compare versions
                        side-by-side with our diff viewer. Pick exactly what you
                        want to keep.
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-green-600" />
                          Full change history
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-amber-500" />
                          Side-by-side comparison
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-amber-500" />
                          Selective merging
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <ScrollReveal delay={300}>
            <div className="rounded-lg border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Your Data, Your Way
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Edit manually, use AI to refine, or combine both. The tool
                adapts to your workflow, not the other way around. Skip AI
                entirely if you want — the editor, templates, and export work
                perfectly without it.
              </p>
              <Link href="/editor">
                <Button size="lg" className="gap-2">
                  <Terminal className="h-4 w-4" />
                  Try Editor Now
                </Button>
              </Link>
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
                Design System
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                <AnimatedCounter end={18} /> templates ×{" "}
                <AnimatedCounter end={4} /> layouts ×{" "}
                <GradientText>∞ color palettes</GradientText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pick a template, choose a layout structure, tweak the color
                palette — and everything combines.{" "}
                <span className="text-foreground font-medium">
                  Thousands of unique combinations
                </span>{" "}
                from one simple system.
              </p>
            </div>
          </ScrollReveal>

          {/* Templates grid */}
          <ScrollReveal delay={100}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold tracking-tight mb-2">
                Templates
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                From classic corporate to Ivy League — each one defines
                typography, spacing, and visual personality.
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

          {/* Layouts */}
          <ScrollReveal>
            <div className="text-center mb-10">
              <h3 className="text-xl font-bold tracking-tight mb-2">
                Layout Structures
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Control how your CV is structured. Every layout works with every
                template — mix and match freely.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mb-16">
            {LAYOUTS.map((l, i) => (
              <LayoutPreview key={l.name} {...l} delay={i * 100} />
            ))}
          </div>

          {/* Color Palettes */}
          <ScrollReveal delay={200}>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold tracking-tight mb-2">
                Infinite Color Palettes
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                14 curated palettes included, plus a full color picker to create
                your own. Each palette defines primary, secondary, and accent
                colors.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <div className="flex justify-center gap-2.5 sm:gap-3.5 mb-8 flex-wrap max-w-3xl mx-auto">
              {LANDING_PALETTES.map((p, i) => (
                <div key={p.name} className="group relative" title={p.name}>
                  <div
                    className={cn(
                      "h-9 w-9 sm:h-11 sm:w-11 rounded-full border-2 border-background shadow-md",
                      "overflow-hidden transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg",
                    )}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Three stripes: primary | secondary | accent */}
                    <div className="flex h-full w-full">
                      <div
                        className="flex-1"
                        style={{ backgroundColor: p.primary }}
                      />
                      <div
                        className="flex-1"
                        style={{ backgroundColor: p.secondary }}
                      />
                      <div
                        className="flex-1"
                        style={{ backgroundColor: p.accent }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {/* Custom palette indicator */}
              <div className="group relative" title="Custom — pick any color">
                <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center text-primary/60 text-base font-bold transition-all duration-300 group-hover:scale-125 group-hover:border-primary">
                  +
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Combination callout */}
          <ScrollReveal delay={300}>
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 p-6 sm:p-8 text-center max-w-3xl mx-auto">
              <h4 className="font-bold text-lg mb-2">Everything combines</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Any template + any layout + any color = your unique CV. Change
                one without affecting the others. Adjust fonts, spacing, and
                accent colors in real time.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative py-24 sm:py-32 overflow-hidden scroll-mt-14 bg-gradient-to-b from-background via-muted/5 to-muted/10"
      >
        {/* Animated background */}
        <div
          className="absolute top-1/3 right-1/3 w-[900px] h-[900px] bg-primary/5 rounded-full blur-[180px] pointer-events-none"
          style={{ animation: "glow 16s ease-in-out infinite" }}
        />

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

      {/* API KEY SECURITY */}
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute right-0 top-1/3 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 border-green-500/20 text-green-700 dark:text-green-400 inline-flex items-center gap-2"
              >
                <Shield className="h-3.5 w-3.5" />
                Your Secrets Safe
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                API Keys.{" "}
                <GradientText>Memory-Only. Never Persisted.</GradientText>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Unlike other tools, we never save your API keys. They exist only
                in memory during your session and are automatically deleted when
                you close the tab.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left: Security Details */}
            <div className="space-y-6">
              <ScrollReveal delay={100}>
                <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Memory Only - No Persistence
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        API keys are stored{" "}
                        <strong>only in the app's memory</strong> (React state),
                        never in localStorage, sessionStorage, cookies, or any
                        other persistent storage. When you close the tab, the
                        key is gone forever.
                      </p>
                      <code className="text-xs bg-muted/80 p-2 rounded flex items-center gap-2 text-muted-foreground font-mono">
                        <span className="text-green-600">✓</span>
                        RAM only (cleared on tab close)
                      </code>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Eye className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Masked Display
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Keys are masked in the UI (shown as dots). You can copy
                        your key, change it, but never view it after entry.
                      </p>
                      <code className="text-xs bg-muted/80 p-2 rounded flex items-center gap-2 text-muted-foreground font-mono">
                        <span className="text-emerald-600">✓</span>
                        sk-...{Array(20).fill("*").join("")}
                      </code>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Auto-Cleared on Close
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Close your browser tab? Your API key is automatically
                        cleared. Zero residual data. Zero tracking.
                      </p>
                      <code className="text-xs bg-muted/80 p-2 rounded flex items-center gap-2 text-muted-foreground font-mono">
                        <span className="text-cyan-600">✓</span>
                        Cleared on tab/browser close
                      </code>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: What This Means */}
            <div className="space-y-6">
              <ScrollReveal delay={250}>
                <div className="rounded-lg border border-border/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Why Memory Only?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        <strong>Zero persistence:</strong> Keys never touch disk
                        or cloud storage
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        <strong>Auto-cleanup:</strong> Automatic deletion when
                        tab closes
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        <strong>No sync attacks:</strong> Can't be stolen from
                        cloud backup or device sync
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        <strong>You control entry:</strong> Must re-enter each
                        session - intentional friction = security
                      </span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Important: Still Vulnerable to XSS
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                        <strong>
                          Memory-only is better than localStorage, but not
                          perfect.
                        </strong>{" "}
                        If someone compromises this website with XSS (cross-site
                        scripting), they could theoretically steal your API key
                        from memory. We take security seriously (no trackers,
                        open source, strict CSP), but:
                      </p>
                      <ul className="space-y-1 text-xs text-red-700 dark:text-red-400">
                        <li>
                          • No storage method is 100% safe if the site itself is
                          compromised
                        </li>
                        <li>
                          • For mission-critical keys, use a backend service or
                          API gateway
                        </li>
                        <li>
                          • This is ideal for non-production/testing API keys
                        </li>
                        <li>
                          • We don't store your key - we give you full control
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <ScrollReveal delay={350}>
            <div className="rounded-lg border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Safe By Design, But Not Foolproof
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Memory-only storage is the best you can do on a client-side app.
                Your key is never saved to disk or synced anywhere. But we're
                honest: if you need bulletproof security for production keys,
                use an API gateway or backend proxy instead.
              </p>
              <Link
                href="/privacy"
                className="text-primary hover:underline text-sm font-medium"
              >
                Read our Privacy Policy & Security Details →
              </Link>
            </div>
          </ScrollReveal>
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

      {/* WHY FREE? */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-muted/10 via-background to-background">
        {/* Animated background elements */}
        <div
          className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[150px] pointer-events-none"
          style={{ animation: "glow 14s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"
          style={{ animation: "glow 12s ease-in-out infinite 2s" }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <Badge
                variant="outline"
                className="mb-4 border-primary/20 text-primary"
              >
                Why Free?
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Because this is how{" "}
                <GradientText>I think software should work</GradientText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                This started as a personal project while exploring practical
                applications of LLMs — tools that support our work without
                making decisions for us.
                <br />
                <span className="font-medium text-foreground">
                  Built for the community, open source, free forever.
                </span>
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Globe,
                title: "Open Source",
                description:
                  "MIT licensed. Fork it, study it, improve it. Full transparency.",
                delay: 0,
              },
              {
                icon: Shield,
                title: "Privacy First",
                description:
                  "No data collection means zero server costs to pass on to you.",
                delay: 100,
              },
              {
                icon: Star,
                title: "Community Driven",
                description:
                  "Built by developers, for developers. Your feedback shapes the roadmap.",
                delay: 200,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={item.delay}>
                  <div
                    className={cn(
                      "group text-center rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6",
                      "transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "h-14 w-14 rounded-xl mx-auto mb-4 flex items-center justify-center",
                        "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10",
                        "transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10",
                      )}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={300}>
            <div
              className={cn(
                "rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8",
                "backdrop-blur-sm",
              )}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-lg mb-2">Stay Connected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Follow my journey exploring LLMs, building open-source
                    tools, and sharing what I learn. Articles, projects, and
                    experiments — all in public.
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <a
                      href="https://www.linkedin.com/in/destbreso/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
                        "bg-primary text-primary-foreground font-medium text-sm",
                        "hover:bg-primary/90 transition-all duration-300 hover:scale-105",
                        "shadow-md shadow-primary/20",
                      )}
                    >
                      <Linkedin className="h-4 w-4" />
                      Follow on LinkedIn
                    </a>
                    <a
                      href="https://destbreso.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
                        "border border-primary/30 bg-background/50 font-medium text-sm",
                        "hover:bg-primary/5 hover:border-primary transition-all duration-300",
                      )}
                    >
                      <Globe className="h-4 w-4" />
                      Visit destbreso.com
                    </a>
                  </div>
                </div>
              </div>
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
      <footer className="border-t border-border/30 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
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
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-sm">
                Build professional resumes with AI-powered tools, beautiful
                templates, and complete privacy. Open source, forever free.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/destbreso/cv-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/destbreso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/editor"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Editor
                  </Link>
                </li>
                <li>
                  <a
                    href="#templates"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a
                    href="https://destbreso.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    Blog & Articles
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground text-center md:text-left">
                <p>
                  © {new Date().getFullYear()} CV Generator. Created by{" "}
                  <a
                    href="https://destbreso.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    David Estévez Bresó
                  </a>
                  .
                </p>
                <p className="text-xs mt-1">
                  Open source under MIT License. Free forever, built for the
                  community.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <a
                  href="https://destbreso.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  destbreso.com
                </a>
                <span className="text-muted-foreground/30">·</span>
                <a
                  href="https://www.linkedin.com/in/destbreso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
                <span className="text-muted-foreground/30">·</span>
                <a
                  href="https://github.com/destbreso/cv-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
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
      "Let AI rewrite bullet points, generate summaries, and suggest improvements — using Ollama, OpenAI, Anthropic, Gemini, Mistral, DeepSeek, Groq, or your own endpoint.",
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
    name: "Google Gemini",
    description: "Gemini 2.0 Flash & Pro — Google's multimodal AI",
    icon: Zap,
    badge: "CLOUD",
  },
  {
    name: "Mistral",
    description: "Mistral & Mixtral models — efficient European AI",
    icon: Zap,
    badge: "CLOUD",
  },
  {
    name: "DeepSeek",
    description: "DeepSeek V3 & R1 — powerful open-weight reasoning",
    icon: Zap,
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
  { name: "Minimal", accent: "bg-slate-600", layout: "single" },
  { name: "Professional", accent: "bg-blue-500", layout: "single" },
  { name: "Modern", accent: "bg-indigo-500", layout: "sidebar" },
  { name: "Creative", accent: "bg-pink-500", layout: "split" },
  { name: "Executive", accent: "bg-amber-600", layout: "sidebar" },
  { name: "Tech", accent: "bg-emerald-500", layout: "single" },
  { name: "Compact", accent: "bg-teal-500", layout: "sidebar" },
  { name: "Academic", accent: "bg-cyan-600", layout: "single" },
  { name: "Elegant", accent: "bg-purple-500", layout: "sidebar" },
  { name: "Swiss", accent: "bg-red-500", layout: "single" },
  { name: "Editorial", accent: "bg-rose-500", layout: "sidebar" },
  { name: "Startup", accent: "bg-orange-500", layout: "split" },
  { name: "Harvard", accent: "bg-red-800", layout: "single" },
  { name: "Oxford", accent: "bg-blue-800", layout: "single" },
  { name: "Cambridge", accent: "bg-sky-600", layout: "sidebar" },
  { name: "Princeton", accent: "bg-amber-500", layout: "split" },
  { name: "Yale", accent: "bg-blue-900", layout: "single" },
  { name: "MIT", accent: "bg-zinc-700", layout: "sidebar" },
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
      "Connect 8 AI providers to generate tailored summaries, bullet points, and skill suggestions. Works with local & cloud models.",
  },
  {
    icon: Palette,
    title: "18 Templates × 4 Layouts × ∞ Palettes",
    description:
      "Every template works with every layout and any color. Mix and match freely — thousands of unique combinations from one system.",
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
    title: "PDF Import & LinkedIn",
    description:
      "Import any existing PDF CV (including LinkedIn's generated PDF) and let AI extract and structure your data automatically.",
  },
  {
    icon: Globe,
    title: "13 Languages Supported",
    description:
      "Generate your CV in English, Spanish, French, German, Portuguese, Italian, Dutch, Chinese, Japanese, Korean, Arabic, Russian, or Hindi.",
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
  { feature: "8 AI provider options", us: true, others: false },
  { feature: "18 templates × 4 layouts × ∞ palettes", us: true, others: false },
  { feature: "4 layout structures", us: true, others: false },
  { feature: "Real-time preview", us: true, others: true },
  { feature: "Version history & diff", us: true, others: false },
  { feature: "Storage transparency", us: true, others: false },
  { feature: "LinkedIn PDF import", us: true, others: true },
  { feature: "Open source (MIT)", us: true, others: false },
  { feature: "Works offline", us: true, others: false },
];

// Palette samples for the landing page (mirrors COLOR_PALETTES from cv-store)
const LANDING_PALETTES = [
  {
    name: "Default",
    primary: "#18181b",
    secondary: "#71717a",
    accent: "#3b82f6",
  },
  {
    name: "Ocean",
    primary: "#0369a1",
    secondary: "#0891b2",
    accent: "#06b6d4",
  },
  {
    name: "Forest",
    primary: "#166534",
    secondary: "#15803d",
    accent: "#22c55e",
  },
  {
    name: "Sunset",
    primary: "#c2410c",
    secondary: "#ea580c",
    accent: "#f97316",
  },
  {
    name: "Grape",
    primary: "#7c3aed",
    secondary: "#8b5cf6",
    accent: "#a78bfa",
  },
  {
    name: "Monochrome",
    primary: "#000000",
    secondary: "#525252",
    accent: "#a3a3a3",
  },
  {
    name: "Slate",
    primary: "#334155",
    secondary: "#64748b",
    accent: "#0ea5e9",
  },
  { name: "Rose", primary: "#9f1239", secondary: "#e11d48", accent: "#fb7185" },
  { name: "Teal", primary: "#115e59", secondary: "#0d9488", accent: "#2dd4bf" },
  {
    name: "Amber",
    primary: "#92400e",
    secondary: "#d97706",
    accent: "#fbbf24",
  },
  { name: "Navy", primary: "#1e3a5f", secondary: "#2563eb", accent: "#60a5fa" },
  {
    name: "Coral",
    primary: "#9a3412",
    secondary: "#f43f5e",
    accent: "#fb923c",
  },
  {
    name: "Lavender",
    primary: "#4c1d95",
    secondary: "#7c3aed",
    accent: "#c4b5fd",
  },
  {
    name: "Charcoal",
    primary: "#1c1917",
    secondary: "#44403c",
    accent: "#78716c",
  },
];
