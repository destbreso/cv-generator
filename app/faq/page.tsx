import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ - CV Generator",
  description: "Frequently asked questions about CV Generator",
};

const faqs = [
  {
    q: "Is CV Generator really free?",
    a: "Yes! CV Generator is completely free and open source. No hidden fees, no premium tiers, no trials. It's free forever.",
  },
  {
    q: "Where is my data stored?",
    a: "All your data is stored locally in your browser using localStorage. Nothing is ever sent to any server. You have complete control and privacy.",
  },
  {
    q: "What AI providers are supported?",
    a: "CV Generator supports Ollama (local), OpenAI, Anthropic, Groq, and any OpenAI-compatible API endpoint. You can also use it without AI.",
  },
  {
    q: "Can I use this offline?",
    a: "Yes! After the first load, CV Generator works completely offline. All processing happens in your browser.",
  },
  {
    q: "How do I export my CV?",
    a: "You can export your CV as PDF, HTML, or Markdown. Simply use the export options in the editor.",
  },
  {
    q: "Can I customize the templates?",
    a: "Absolutely! You can customize colors, fonts, spacing, and even upload your own custom templates and layouts.",
  },
  {
    q: "Is my data private?",
    a: "100% yes. Since everything runs in your browser and nothing is sent to any server, your data is completely private. You can even use CV Generator offline.",
  },
  {
    q: "Can I import my LinkedIn data?",
    a: "Yes! You can upload a LinkedIn PDF export and CV Generator will parse and structure your data automatically.",
  },
  {
    q: "How do themes work?",
    a: "CV Generator includes three themes: Console Light, Console Dark, and Modern. Each theme changes the color palette of your CV.",
  },
  {
    q: "Can I contribute to the project?",
    a: "Yes! CV Generator is open source under the MIT license. Contributions, bug reports, and feature requests are welcome on GitHub.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/">
          <Button variant="ghost" className="mb-8 -ml-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="h-10 w-10 text-primary" />
          <h1 className="text-2xl sm:text-4xl font-bold">Frequently Asked Questions</h1>
        </div>

        <p className="text-base sm:text-lg text-muted-foreground mb-12">
          Everything you need to know about CV Generator
        </p>

        <div className="space-y-6 sm:space-y-8">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card p-4 sm:p-6 hover:border-primary/30 transition-colors"
            >
              <h2 className="text-lg font-semibold mb-3 flex items-start gap-2">
                <span className="text-primary">Q:</span>
                {faq.q}
              </h2>
              <p className="text-muted-foreground leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border/50 bg-card p-5 sm:p-8 text-center">
          <h3 className="text-lg sm:text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Feel free to reach out through LinkedIn or check out the blog for
            more articles.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://www.linkedin.com/in/destbreso/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Contact on LinkedIn</Button>
            </a>
            <a
              href="https://destbreso.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Visit Blog</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
