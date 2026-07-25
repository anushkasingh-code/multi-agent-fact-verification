import { useState } from "react";
import { X, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const stepsData = [
    {
      step: 1,
      title: "1. Prompt Injection & Expansion",
      description: "User submits query: 'Explain LK-99 ambient superconductor zero-loss quantum levitation.'",
      badge: "Analyst Agent",
      badgeColor: "text-purple-700 bg-purple-50 border border-purple-200",
      content: "The Analyst Agent deconstructs the prompt into 3 atomic claims: (1) Ambient pressure, (2) Zero-loss conductivity, (3) Meissner levitation.",
    },
    {
      step: 2,
      title: "2. Primary Source Scraping",
      description: "Scraper Agent queries 24 pre-printed datasets across arXiv, Nature, and Physical Review B.",
      badge: "Scraper Agent",
      badgeColor: "text-indigo-700 bg-indigo-50 border border-indigo-200",
      content: "Found 18 replication attempts across Max Planck Institute, Harvard, and Peking University reporting ferromagnetism rather than superconductivity.",
    },
    {
      step: 3,
      title: "3. Hallucination Isolation & Scrubbing",
      description: "Logic Critic isolates a model hallucination in real-time.",
      badge: "Logic Critic",
      badgeColor: "text-rose-700 bg-rose-50 border border-rose-200",
      content: "ISOLATED HALLUCINATION: Model claimed zero resistivity was confirmed at 400K. Logic Critic flags this as an unverified LLM extrapolation contradicting 18 primary replication studies.",
    },
    {
      step: 4,
      title: "4. Final Verified Synthesis & Footnotes",
      description: "VeriSphere generates a 98.6% veracity rated report with primary DOI links.",
      badge: "Synthesizer & Validator",
      badgeColor: "text-emerald-800 bg-emerald-50 border border-emerald-200",
      content: "Final Report correctly identifies ferromagnetic impurities (Cu2S phase transition) as the source of partial levitation, eliminating model hallucination with IEEE & Nature citations.",
    },
  ];

  const current = stepsData[step - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card max-w-xl w-full rounded-2xl p-6 border border-gray-200 bg-white space-y-6 relative animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Interactive Demo Walkthrough</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{current.title}</h2>
          <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${current.badgeColor}`}>
            {current.badge}
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{current.description}</p>

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs text-gray-800 leading-relaxed">
          {current.content}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`w-3 h-3 rounded-full transition-all ${
                  step === s ? "bg-[#4F46E5] scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-200 border border-gray-200"
              >
                Previous
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-1"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
              >
                Finish Demo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
