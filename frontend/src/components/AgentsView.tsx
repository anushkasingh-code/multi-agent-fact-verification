import { useState } from "react";
import { Agent } from "../types";
import {
  Cpu,
  ShieldAlert,
  Search,
  CheckCircle,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  Database,
  Globe,
  BookOpen,
} from "lucide-react";

export function AgentsView() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "agent-scraper",
      name: "Scraper Agent",
      role: "Primary Web & Literature Extraction",
      type: "scraper",
      status: "active",
      description: "Harvests raw data across arXiv, IEEE Xplore, PubMed, and Google Search Grounding.",
      accuracy: 99.2,
      tasksCompleted: 1420,
      iconName: "Globe",
      color: "text-indigo-700",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      enabled: true,
      capabilities: ["arXiv Extraction", "IEEE Paper Scraper", "PubMed API", "Web Grounding"],
    },
    {
      id: "agent-analyst",
      name: "Analyst Agent",
      role: "Logical Deduction & Claim Breakdown",
      type: "analyst",
      status: "active",
      description: "Deconstructs complex research queries into testable atomic claims.",
      accuracy: 98.7,
      tasksCompleted: 1180,
      iconName: "Cpu",
      color: "text-purple-700",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      enabled: true,
      capabilities: ["Atomic Claim Extraction", "Semantic Topology", "Hypothesis Mapping"],
    },
    {
      id: "agent-critic",
      name: "Logic Critic",
      role: "Contradiction & Stress Testing",
      type: "critic",
      status: "processing",
      description: "Identifies speculative extrapolations and model hallucinations before synthesis.",
      accuracy: 97.9,
      tasksCompleted: 950,
      iconName: "ShieldAlert",
      color: "text-rose-700",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
      enabled: true,
      capabilities: ["Hallucination Isolation", "Contradiction Detection", "Fallacy Checker"],
    },
    {
      id: "agent-validator",
      name: "Fact Validator",
      role: "DOI & Primary Source Cross-Reference",
      type: "validator",
      status: "verifying",
      description: "Matches extracted claims against verified truth ledgers and primary DOI records.",
      accuracy: 99.8,
      tasksCompleted: 2310,
      iconName: "CheckCircle",
      color: "text-cyan-700",
      badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      enabled: true,
      capabilities: ["DOI Verification", "Ledger Validation", "Data Provenance"],
    },
    {
      id: "agent-synthesizer",
      name: "Synthesizer Agent",
      role: "Report Formatting & Citation Engine",
      type: "synthesizer",
      status: "active",
      description: "Compiles verified claims into cited markdown reports with formatted footnotes.",
      accuracy: 99.4,
      tasksCompleted: 1840,
      iconName: "Sparkles",
      color: "text-emerald-700",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      enabled: true,
      capabilities: ["LaTeX Formatting", "IEEE Citation Rules", "Footnote Linking"],
    },
  ]);

  const [strictness, setStrictness] = useState<"low" | "medium" | "high">("high");
  const [sourcesCount, setSourcesCount] = useState<number>(20);
  const [testSimulating, setTestSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleRunSim = () => {
    setTestSimulating(true);
    setSimLog(["[0.0s] Initializing VeriSphere Swarm Protocol..."]);

    setTimeout(() => {
      setSimLog((p) => [...p, "[0.8s] Scraper Agent: Fetched 22 references from IEEE and PubMed."]);
    }, 800);

    setTimeout(() => {
      setSimLog((p) => [...p, "[1.5s] Analyst Agent: Deconstructed 5 core claims."]);
    }, 1500);

    setTimeout(() => {
      setSimLog((p) => [...p, "[2.2s] Logic Critic: Isolated 1 model hallucination (unverified scaling claim)."]);
    }, 2200);

    setTimeout(() => {
      setSimLog((p) => [...p, "[3.0s] Fact Validator: Verified 4 remaining claims against primary DOI ledger."]);
    }, 3000);

    setTimeout(() => {
      setSimLog((p) => [...p, "[3.8s] Synthesizer: Generated cited report with 98.2% veracity score."]);
      setTestSimulating(false);
    }, 3800);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 text-gray-900">
      {/* Title & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Cpu className="w-8 h-8 text-[#4F46E5]" />
            <span>Autonomous Swarm Agents</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Configure, inspect, and test specialized AI agents working in synchronized research pipelines.
          </p>
        </div>

        <button
          onClick={handleRunSim}
          disabled={testSimulating}
          className="px-6 py-3 bg-[#4F46E5] text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20"
        >
          {testSimulating ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Simulating Swarm...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Test Agent Swarm</span>
            </>
          )}
        </button>
      </div>

      {/* Simulation Terminal Output */}
      {simLog.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-1.5 text-slate-200 shadow-md">
          <div className="flex items-center justify-between text-xs text-indigo-300 pb-2 border-b border-slate-800">
            <span className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
              Live Swarm Diagnostics Console
            </span>
            <span>Status: {testSimulating ? "RUNNING" : "COMPLETED"}</span>
          </div>
          {simLog.map((log, idx) => (
            <p key={idx} className="leading-relaxed">
              {log}
            </p>
          ))}
        </div>
      )}

      {/* Global Swarm Parameters */}
      <div className="glass-card rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border border-gray-200 bg-white shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Hallucination Strictness
          </label>
          <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200">
            {(["low", "medium", "high"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStrictness(s)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  strictness === s
                    ? "bg-[#4F46E5] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Target Literature Sources ({sourcesCount})
          </label>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={sourcesCount}
            onChange={(e) => setSourcesCount(Number(e.target.value))}
            className="w-full accent-[#4F46E5] cursor-pointer mt-2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Primary Knowledge Bases
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1 font-medium">
              <BookOpen className="w-3 h-3 text-[#06B6D4]" /> arXiv
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1 font-medium">
              <Globe className="w-3 h-3 text-[#4F46E5]" /> IEEE Xplore
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1 font-medium">
              <Database className="w-3 h-3 text-purple-600" /> PubMed
            </span>
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`glass-card rounded-2xl p-6 flex flex-col justify-between space-y-5 border transition-all bg-white shadow-sm ${
              agent.enabled ? "border-gray-200 hover:border-indigo-300" : "opacity-50 border-gray-200"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gray-100 border border-gray-200 ${agent.color}`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{agent.name}</h3>
                    <p className="text-xs text-gray-500">{agent.role}</p>
                  </div>
                </div>

                {/* Enable Toggle */}
                <button
                  onClick={() => toggleAgent(agent.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    agent.enabled ? "bg-[#4F46E5]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      agent.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                {agent.description}
              </p>

              {/* Capabilities Chips */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {agent.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-[11px] text-gray-700"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-gray-500">Accuracy: </span>
                <span className="text-emerald-700 font-bold">{agent.accuracy}%</span>
              </div>
              <div>
                <span className="text-gray-500">Verified: </span>
                <span className="text-gray-900 font-bold">{agent.tasksCompleted}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
