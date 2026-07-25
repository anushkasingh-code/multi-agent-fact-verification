import { useState, useEffect } from "react";
import { CollaborationMessage } from "../types";
import { useAnalysisContext } from "../context/AnalysisContext";
import {
  Users,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Cpu,
  Globe,
  Database,
  ArrowRight,
  Activity,
  MessageSquare,
  Bot,
  Zap,
} from "lucide-react";

export function AgentCollaborationView() {
  const sampleScenarios = [
    {
      id: "scen-1",
      topic: "LK-99 Ambient Superconductor Re-evaluation",
      prompt: "Verify ambient pressure superconductivity claims in Cu2S-doped lead apatite.",
    },
    {
      id: "scen-2",
      topic: "Quantum Error Correction Fault-Tolerance Below 10^-4",
      prompt: "Audit physical qubit error rates across Google Sycamore and IBM Quantum Eagle.",
    },
    {
      id: "scen-3",
      topic: "DeepSeek-R1 Distillation & Reasoning Verification",
      prompt: "Cross-check reasoning trajectories against MATH-500 and GPQA Diamond benchmarks.",
    },
  ];

  const initialThread: CollaborationMessage[] = [
    {
      id: "msg-1",
      agentId: "research-agent",
      agentName: "Research Agent",
      agentRole: "Primary Data Discovery",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTzYzg3nCMm8De78_aTJYrPgyPXvYUSwt3UPbRpYkQG6SqDa1cC0lpvDfrADv2MEYDlOzQJzQDqkWLl840zTqPxaBI8_JmoxaE_TdEdarn5e4jaP4eg3OiQXRUd4CgR0LT2LFjygjGO9NtBfOAdQpKiip_eBYxiuSftQdQYuJsPwnfrwVO0uJGO07yFqnMcYI_rmbCV72CbmkGsD4an3FQZH2TL0bUSkEiBhz6_xW-L_I8AJyHwuPzyWbp-6CBaM5BpjP7RNp9BzY3",
      message: "I discovered 18 reliable sources across arXiv, Nature, and IEEE Xplore.",
      reasoning: "Executing parallel scraping across peer-reviewed repositories. Indexed 18 primary pre-prints published between 2024–2026 with DOI validation.",
      timestamp: "10:42:01 AM",
      status: "discovering",
      progress: 100,
      color: "text-blue-600",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      actionPayload: "18 Datasets Ingested (4.2 MB)",
    },
    {
      id: "msg-2",
      agentId: "verification-agent",
      agentName: "Verification Agent",
      agentRole: "Peer-Review & Fact Validation",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aCbN2eqkgwT6AtFIRaMDQoYRyM0xL4mUxZ_r5q9BFVAPqsar5p9gdZ2Woyhxfi6f8oRZaqbc5vPNHto6rP9SnWmnGtMYRW4CpjppuPCKN6YOIAv7CtnhjSMoWsHZ7Z7aH3-wjGYb1kQmrmLNPaTkXwh3Ra42eVL3s5V2aWcewuwfapCXKuveK1QaAULYjhrJEogaN4yH0pK4Raw1Y3DD9420e5CysiRNXKyqF_iea-M4zD9er4eF2NhlQ0L0aLKjWhFMa_bRWDhr",
      message: "Cross-checking extracted claims against Nature Materials and WHO primary databases.",
      reasoning: "Extracted 6 core atomic claims. Running semantic embedding similarity matches against top-tier institutional peer-reviewed literature.",
      timestamp: "10:42:04 AM",
      status: "cross-checking",
      progress: 85,
      color: "text-cyan-600",
      badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      actionPayload: "6 Claims Parsed • 5 Matched Verified",
    },
    {
      id: "msg-3",
      agentId: "contradiction-detector",
      agentName: "Contradiction Detector",
      agentRole: "Logic Critic & Paradox Isolation",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDav8Y4XXmvw5jLlSh2MsIjZBmu5XNx_93WSGO6XlHI-H-GovcS3r1Swn3XxGoj1mmtP_nPZNm5by4WK_ujOR5N4rak4TNTpppn1UAfMNeq2oy7VDC4-r2YuFaGvCP6w8Q_5M7fI59BZLbY6EvYAfBvcVEOb2ov2ph84edTQQpUau93ntL4YmkpjHAGpry3VWxbSqrU45rIAsZ1fgSikNbHdBbyVtIQMoQ0f0Lsp9BmLljWgVstdpYk1RJwuBjDV7MayOhoSr9eOAHo",
      message: "Contradiction Identified: Claim #4 conflicts with Reuters investigation & Max Planck lab replication.",
      reasoning: "ISOLATED HALLUCINATION: Source #4 asserts 300K zero-resistance, but 3 independent lab replications prove resistivity drops stem from Cu2S impurity transitions.",
      timestamp: "10:42:08 AM",
      status: "detecting",
      progress: 100,
      color: "text-red-600",
      badgeBg: "bg-red-50 text-red-700 border-red-200",
      actionPayload: "1 Hallucination Flagged & Isolated",
    },
    {
      id: "msg-4",
      agentId: "citation-agent",
      agentName: "Citation Agent",
      agentRole: "DOIs & Citation Indexing",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTzYzg3nCMm8De78_aTJYrPgyPXvYUSwt3UPbRpYkQG6SqDa1cC0lpvDfrADv2MEYDlOzQJzQDqkWLl840zTqPxaBI8_JmoxaE_TdEdarn5e4jaP4eg3OiQXRUd4CgR0LT2LFjygjGO9NtBfOAdQpKiip_eBYxiuSftQdQYuJsPwnfrwVO0uJGO07yFqnMcYI_rmbCV72CbmkGsD4an3FQZH2TL0bUSkEiBhz6_xW-L_I8AJyHwuPzyWbp-6CBaM5BpjP7RNp9BzY3",
      message: "Generated IEEE & BibTeX footnotes with active DOI links.",
      reasoning: "Formatted 14 primary references into strict IEEE specification. Bound footnotes to specific claim IDs in the draft manuscript.",
      timestamp: "10:42:12 AM",
      status: "generating",
      progress: 95,
      color: "text-purple-600",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      actionPayload: "14 Footnote Links Attached",
    },
    {
      id: "msg-5",
      agentId: "report-generator",
      agentName: "Report Generator",
      agentRole: "Synthesis & Veracity Calculation",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aCbN2eqkgwT6AtFIRaMDQoYRyM0xL4mUxZ_r5q9BFVAPqsar5p9gdZ2Woyhxfi6f8oRZaqbc5vPNHto6rP9SnWmnGtMYRW4CpjppuPCKN6YOIAv7CtnhjSMoWsHZ7Z7aH3-wjGYb1kQmrmLNPaTkXwh3Ra42eVL3s5V2aWcewuwfapCXKuveK1QaAULYjhrJEogaN4yH0pK4Raw1Y3DD9420e5CysiRNXKyqF_iea-M4zD9er4eF2NhlQ0L0aLKjWhFMa_bRWDhr",
      message: "Confidence score updated to 91.4%. Final verified synthesis compiled.",
      reasoning: "Recalculated global veracity index after removing flagged hallucination. Final consensus score: 91.4% (VERIFIED WITH RESERVATIONS).",
      timestamp: "10:42:15 AM",
      status: "complete",
      progress: 100,
      color: "text-emerald-600",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      actionPayload: "Final Report Ready • Veracity 91.4%",
    },
  ];

  const { computedCollaborationMessages } = useAnalysisContext();
  const activeThread = computedCollaborationMessages.length > 0 ? computedCollaborationMessages : initialThread;

  const [visibleCount, setVisibleCount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState(sampleScenarios[0]);
  const [speedMs, setSpeedMs] = useState(1800);

  useEffect(() => {
    if (!isPlaying) return;

    if (visibleCount < activeThread.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, speedMs);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [visibleCount, isPlaying, speedMs, activeThread]);

  const handleReplay = () => {
    setVisibleCount(1);
    setIsPlaying(true);
  };

  const getStatusIcon = (status: CollaborationMessage["status"]) => {
    switch (status) {
      case "discovering":
        return <Search className="w-3.5 h-3.5 text-[#b4c5ff]" />;
      case "cross-checking":
        return <Activity className="w-3.5 h-3.5 text-[#4cd7f6]" />;
      case "detecting":
        return <AlertTriangle className="w-3.5 h-3.5 text-[#ffb4ab]" />;
      case "generating":
        return <FileText className="w-3.5 h-3.5 text-[#d2bbff]" />;
      case "complete":
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-[#7c3aed]" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 text-gray-900">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2 shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Autonomous Swarm Protocol</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Real-Time AI Agent Collaboration Workspace
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Observe five specialized AI agents as they debate, cross-reference, detect hallucinations, and synthesize facts live.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Swarm</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <button
            onClick={handleReplay}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-xl border border-gray-300 transition-all flex items-center gap-2 shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-[#4F46E5]" />
            <span>Replay Session</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase mr-2">Research Scenario:</span>
        {sampleScenarios.map((scen) => (
          <button
            key={scen.id}
            onClick={() => {
              setSelectedScenario(scen);
              handleReplay();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedScenario.id === scen.id
                ? "bg-[#4F46E5] text-white font-bold shadow-md shadow-indigo-500/20"
                : "bg-white text-gray-700 hover:text-gray-900 border border-gray-200"
            }`}
          >
            {scen.topic}
          </button>
        ))}
      </div>

      {/* Swarm Live Telemetry Header Banner */}
      <div className="glass-card rounded-2xl p-4 border border-gray-200 bg-white shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="text-gray-500 block">Active Agents</span>
            <span className="text-gray-900 font-bold">5 Specialized Nodes</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-[#06B6D4]" />
          <div>
            <span className="text-gray-500 block">Latency / Throughput</span>
            <span className="text-gray-900 font-bold">18ms • 1,240 tokens/sec</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <div>
            <span className="text-gray-500 block">Claims Verified</span>
            <span className="text-emerald-700 font-bold">6 Atomic Claims</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Bot className="w-4 h-4 text-[#4F46E5]" />
          <div>
            <span className="text-gray-500 block">Swarm Status</span>
            <span className="text-indigo-700 font-bold">
              {visibleCount === activeThread.length ? "SYNTHESIS COMPLETE" : `STEP ${visibleCount} OF ${activeThread.length} RUNNING`}
            </span>
          </div>
        </div>
      </div>

      {/* Collaborative Workspace Feed */}
      <div className="space-y-6 relative before:absolute before:left-6 before:top-6 before:bottom-6 before:w-0.5 before:bg-gray-200">
        {activeThread.slice(0, visibleCount).map((msg, index) => {
          return (
            <div
              key={msg.id}
              className="relative pl-14 animate-in fade-in slide-in-from-bottom-3 duration-500"
            >
              {/* Timeline Node Avatar Icon */}
              <div className="absolute left-1 top-1.5 w-10 h-10 rounded-xl bg-white border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm z-10 group">
                <img
                  src={msg.avatar}
                  alt={msg.agentName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>

              {/* Message Glass Card */}
              <div className="glass-card glass-card-hover rounded-2xl p-5 border border-gray-200 bg-white shadow-sm space-y-3.5">
                {/* Message Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`font-bold text-sm text-gray-900 flex items-center gap-1.5`}>
                      {msg.agentName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-mono text-gray-600 border border-gray-200">
                      {msg.agentRole}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase flex items-center gap-1.5 ${msg.badgeBg}`}>
                      {getStatusIcon(msg.status)}
                      <span>{msg.status}</span>
                    </span>
                    <span className="text-gray-400 font-mono text-[11px]">{msg.timestamp}</span>
                  </div>
                </div>

                {/* Main Speech Bubble Content */}
                <div className="text-sm md:text-base font-medium text-gray-900 leading-relaxed">
                  "{msg.message}"
                </div>

                {/* Reasoning Box & Action Payload */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1 text-[#4F46E5] font-semibold">
                      <Sparkles className="w-3 h-3" />
                      Agent Internal Reasoning Trajectory:
                    </span>
                    {msg.actionPayload && (
                      <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[#06B6D4] text-[10px] font-bold">
                        {msg.actionPayload}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans">{msg.reasoning}</p>
                </div>

                {/* Agent Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span>Agent Execution Progress</span>
                    <span className="text-gray-900 font-bold">{msg.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] transition-all duration-700 rounded-full"
                      style={{ width: `${msg.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {visibleCount === activeThread.length && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-500 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-950">Collaborative Agent Cycle Complete</h4>
              <p className="text-xs text-emerald-800">
                18 sources indexed • 1 hallucination caught • 91.4% confidence rating assigned.
              </p>
            </div>
          </div>

          <button
            onClick={handleReplay}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
          >
            Re-run Agent Swarm
          </button>
        </div>
      )}
    </div>
  );
}
