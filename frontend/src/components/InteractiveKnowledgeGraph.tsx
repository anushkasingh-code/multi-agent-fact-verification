import { useState } from "react";
import { GraphNode, GraphEdge } from "../types";
import {
  Share2,
  Maximize2,
  Minimize2,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Globe,
  ExternalLink,
  ShieldCheck,
  Search,
  BookOpen,
  X,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

export function InteractiveKnowledgeGraph() {
  const initialNodes: GraphNode[] = [
    {
      id: "node-topic",
      label: "LK-99 Ambient Superconductivity",
      type: "topic",
      status: "topic",
      credibilityScore: 91.4,
      pubDate: "2026-07-24",
      extractedClaims: ["Zero electrical resistance at 293K", "Meissner effect magnetic levitation"],
      x: 50,
      y: 45,
      summary: "Main research topic investigating claims of room-temperature ambient-pressure superconductivity.",
      supportingEvidence: "Analyzed across 24 international replication papers and institutional pre-prints.",
      citation: "VeriSphere Swarm Ledger ID: #LK99-2026-001",
      confidence: 91.4,
      relationships: ["node-claim1", "node-claim2", "node-claim3", "node-paper1", "node-gov1"],
    },
    {
      id: "node-claim1",
      label: "Claim #1: Meissner Levitation Effect",
      type: "claim",
      status: "verified",
      credibilityScore: 96.8,
      pubDate: "2026-07-20",
      extractedClaims: ["Partial levitation observed over NdFeB magnets"],
      x: 25,
      y: 25,
      summary: "Partial magnetic levitation confirmed via video and x-ray crystallography.",
      supportingEvidence: "Confirmed by Max Planck Institute for Solid State Research via high-purity single crystal synthesis.",
      citation: "Nature Materials doi:10.1038/s41563-024-01890-x",
      confidence: 96.8,
      relationships: ["node-topic", "node-paper1"],
    },
    {
      id: "node-claim2",
      label: "Claim #2: Zero Resistance at 300K",
      type: "claim",
      status: "contradicted",
      credibilityScore: 24.1,
      pubDate: "2026-07-22",
      extractedClaims: ["Zero resistivity below 370K (100°C)"],
      x: 75,
      y: 25,
      summary: "Alleged zero electrical resistance refuted by 18 independent four-point probe measurements.",
      supportingEvidence: "Resistivity drops stem from Cu2S phase transition at 377K rather than true superconductivity.",
      citation: "Physical Review B 108, 174501 (2024)",
      confidence: 24.1,
      relationships: ["node-topic", "node-paper2", "node-[#news1]"],
    },
    {
      id: "node-claim3",
      label: "Claim #3: Cu2S Structural Phase Transition",
      type: "claim",
      status: "partially",
      credibilityScore: 88.5,
      pubDate: "2026-07-23",
      extractedClaims: ["Copper sulfide impurities cause sudden resistivity drops"],
      x: 50,
      y: 80,
      summary: "Cu2S impurities undergo a first-order structural transition near 377K, mimicking a superconducting transition.",
      supportingEvidence: "Identified independently by Peking University and University of Maryland CMDTC.",
      citation: "arXiv:2308.05222 [cond-mat.supr-con]",
      confidence: 88.5,
      relationships: ["node-topic", "node-[#news1]", "node-gov1"],
    },
    {
      id: "node-paper1",
      label: "Max Planck Institute Synthesis Study",
      type: "paper",
      status: "verified",
      credibilityScore: 99.2,
      pubDate: "2026-05-14",
      extractedClaims: ["Pure single-crystal Pb10-xCux(PO4)6O crystals are insulating, not superconducting"],
      x: 18,
      y: 65,
      summary: "High-purity crystals synthesized without Cu2S impurities exhibited high electrical resistivity.",
      supportingEvidence: "Eliminated ferromagnetism and thermal artifacts.",
      citation: "Nature 621, 66–70 (2023)",
      confidence: 99.2,
      relationships: ["node-claim1", "node-topic"],
    },
    {
      id: "node-paper2",
      label: "IEEE Xplore: Four-Point Probe Audit",
      type: "paper",
      status: "contradicted",
      credibilityScore: 97.4,
      pubDate: "2026-06-01",
      extractedClaims: ["Initial 10^-5 Ω·cm resistivity measurements contained contact thermal noise"],
      x: 82,
      y: 65,
      summary: "Rigorous electrical transport measurements revealed finite non-zero resistance at all temperatures.",
      supportingEvidence: "Calibrated against copper reference standard.",
      citation: "IEEE Transactions on Applied Superconductivity, Vol 34, No 4",
      confidence: 97.4,
      relationships: ["node-claim2", "node-topic"],
    },
    {
      id: "node-[#news1]",
      label: "Reuters Technology Investigation",
      type: "news",
      status: "partially",
      credibilityScore: 89.0,
      pubDate: "2026-07-15",
      extractedClaims: ["Global labs fail to replicate initial room-temperature superconductivity claims"],
      x: 85,
      y: 85,
      summary: "Journalistic synthesis of global replication efforts across 15 materials science labs.",
      supportingEvidence: "Interviews with leading solid-state physicists.",
      citation: "Reuters Special Report: The LK-99 Saga",
      confidence: 89.0,
      relationships: ["node-claim2", "node-claim3"],
    },
    {
      id: "node-gov1",
      label: "US Department of Energy Materials Registry",
      type: "government",
      status: "verified",
      credibilityScore: 99.8,
      pubDate: "2026-07-01",
      extractedClaims: ["Official material classification: Diamagnetic Insulator with Cu2S Phase Transition"],
      x: 15,
      y: 85,
      summary: "National lab database classification for synthetic lead-apatite compounds.",
      supportingEvidence: "Consensus evaluation by Argonne National Laboratory.",
      citation: "DOE Materials Project Record #MP-98421",
      confidence: 99.8,
      relationships: ["node-topic", "node-claim3"],
    },
  ];

  const initialEdges: GraphEdge[] = [
    { id: "e1", source: "node-topic", target: "node-claim1", status: "verified" },
    { id: "e2", source: "node-topic", target: "node-claim2", status: "contradicted" },
    { id: "e3", source: "node-topic", target: "node-claim3", status: "partially" },
    { id: "e4", source: "node-claim1", target: "node-paper1", status: "verified" },
    { id: "e5", source: "node-claim2", target: "node-paper2", status: "contradicted" },
    { id: "e6", source: "node-claim2", target: "node-[#news1]", status: "contradicted" },
    { id: "e7", source: "node-claim3", target: "node-gov1", status: "verified" },
    { id: "e8", source: "node-paper1", target: "node-gov1", status: "verified" },
  ];

  const [nodes] = useState<GraphNode[]>(initialNodes);
  const [edges] = useState<GraphEdge[]>(initialEdges);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const getNodeColor = (status: GraphNode["status"]) => {
    switch (status) {
      case "verified":
        return {
          bg: "bg-emerald-500",
          border: "border-emerald-600",
          glow: "shadow-xs",
          text: "text-emerald-700",
          badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "partially":
        return {
          bg: "bg-amber-500",
          border: "border-amber-600",
          glow: "shadow-xs",
          text: "text-amber-700",
          badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "contradicted":
        return {
          bg: "bg-rose-500",
          border: "border-rose-600",
          glow: "shadow-xs",
          text: "text-rose-700",
          badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
        };
      case "topic":
      default:
        return {
          bg: "bg-[#4F46E5]",
          border: "border-indigo-400",
          glow: "shadow-xs",
          text: "text-indigo-700",
          badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
    }
  };

  const filteredNodes = nodes.filter((n) => {
    if (filterType === "all") return true;
    if (filterType === "verified") return n.status === "verified";
    if (filterType === "claims") return n.type === "claim";
    if (filterType === "sources") return n.type === "paper" || n.type === "news" || n.type === "government";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 text-gray-900">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2 shadow-xs">
            <Share2 className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Semantic Evidence Topography</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Interactive Multi-Source Knowledge Graph
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Explore topological relationships connecting research papers, news reports, government registries, and verified claims.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#4F46E5]" />
            <span className="text-gray-900">Main Topic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-emerald-700">Verified (95%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-amber-700">Partially Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-rose-700">Contradicted</span>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase mr-1">Filter Nodes:</span>
          {[
            { id: "all", label: "All Nodes (8)" },
            { id: "verified", label: "Verified Only" },
            { id: "claims", label: "Claims Only" },
            { id: "sources", label: "Primary Sources" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterType === f.id
                  ? "bg-[#4F46E5] text-white font-bold shadow-xs"
                  : "bg-white text-gray-700 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-gray-500 hidden md:block">
          Click any node to view supporting evidence drawer
        </div>
      </div>

      {/* Graph Visual Canvas */}
      <div className="relative w-full h-[540px] rounded-3xl glass-card border border-gray-200 overflow-hidden shadow-sm bg-slate-50/70">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="gradVerified" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="gradContradicted" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {edges.map((edge) => {
            const srcNode = nodes.find((n) => n.id === edge.source);
            const tgtNode = nodes.find((n) => n.id === edge.target);
            if (!srcNode || !tgtNode) return null;

            return (
              <g key={edge.id}>
                <line
                  x1={`${srcNode.x}%`}
                  y1={`${srcNode.y}%`}
                  x2={`${tgtNode.x}%`}
                  y2={`${tgtNode.y}%`}
                  stroke={edge.status === "contradicted" ? "#ef4444" : "#6366F1"}
                  strokeWidth="2"
                  strokeDasharray={edge.status === "contradicted" ? "4 4" : "none"}
                  opacity="0.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Render Graph Nodes */}
        {filteredNodes.map((node) => {
          const style = getNodeColor(node.status);
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNode?.id === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                isSelected ? "scale-125 z-30" : isHovered ? "scale-110 z-20" : "scale-100"
              }`}
            >
              {/* Outer pulsing ring for selected node */}
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${style.bg} ${style.border} ${style.glow} border-2 flex flex-col items-center justify-center p-2 text-center text-white font-bold transition-all shadow-md`}
              >
                {node.type === "topic" && <Sparkles className="w-5 h-5 text-white" />}
                {node.type === "claim" && <ShieldCheck className="w-5 h-5 text-white" />}
                {node.type === "paper" && <BookOpen className="w-5 h-5 text-white" />}
                {node.type === "news" && <Globe className="w-5 h-5 text-white" />}
                {node.type === "government" && <FileText className="w-5 h-5 text-white" />}

                <span className="text-[10px] leading-tight font-sans truncate w-full mt-1">
                  {node.type.toUpperCase()}
                </span>
              </div>

              {/* Node Label Floating Pill */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-gray-300 text-[11px] font-semibold text-gray-900 shadow-sm pointer-events-none">
                {node.label}
              </div>
            </div>
          );
        })}

        {/* Hover Tooltip Overlay */}
        {hoveredNode && !selectedNode && (
          <div
            style={{
              left: `${Math.min(Math.max(hoveredNode.x, 20), 80)}%`,
              top: `${Math.min(Math.max(hoveredNode.y - 18, 15), 70)}%`,
            }}
            className="absolute -translate-x-1/2 z-40 w-72 p-4 glass-card bg-white rounded-2xl border border-gray-300 shadow-xl pointer-events-none animate-in fade-in duration-200"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-800 border border-gray-200">
                  {hoveredNode.type}
                </span>
                <span className={`text-xs font-bold ${getNodeColor(hoveredNode.status).text}`}>
                  Credibility: {hoveredNode.credibilityScore}%
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm leading-tight">{hoveredNode.label}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{hoveredNode.summary}</p>
              <div className="text-[10px] text-gray-400 font-mono">Pub Date: {hoveredNode.pubDate}</div>
            </div>
          </div>
        )}
      </div>

      {/* Side Detail Panel / Drawer when a node is clicked */}
      {selectedNode && (
        <div className="glass-card rounded-2xl p-6 border border-gray-200 bg-white shadow-md space-y-5 animate-in slide-in-from-bottom-4 duration-300 relative">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getNodeColor(selectedNode.status).badgeBg}`}>
                  {selectedNode.status.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 font-mono">Published: {selectedNode.pubDate}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{selectedNode.label}</h3>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500 uppercase block font-semibold">Node Confidence</span>
              <span className={`text-2xl font-extrabold ${getNodeColor(selectedNode.status).text}`}>
                {selectedNode.credibilityScore}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-[#06B6D4]" />
                Summary & Context
              </h4>
              <p className="text-gray-700 leading-relaxed">{selectedNode.summary}</p>

              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Supporting Empirical Evidence
              </h4>
              <p className="text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-xl border border-gray-200 font-sans">
                "{selectedNode.supportingEvidence}"
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4F46E5]" />
                Extracted Claims ({selectedNode.extractedClaims.length})
              </h4>
              <ul className="space-y-2">
                {selectedNode.extractedClaims.map((claim, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 flex items-start gap-2"
                  >
                    <span className="text-[#4F46E5] font-bold">•</span>
                    <span>{claim}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3">
                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Citation Record</span>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs text-[#4F46E5] font-semibold flex items-center justify-between">
                  <span className="truncate">{selectedNode.citation}</span>
                  <ExternalLink className="w-4 h-4 shrink-0 text-gray-400 hover:text-gray-900 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
