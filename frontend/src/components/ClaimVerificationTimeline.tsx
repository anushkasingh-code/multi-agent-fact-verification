import { useState } from "react";
import { ClaimItem } from "../types";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RotateCcw,
  Sparkles,
  FileText,
  Activity,
  Layers,
  Search,
  Check,
} from "lucide-react";

export function ClaimVerificationTimeline() {
  const initialClaims: ClaimItem[] = [
    {
      id: "claim-1",
      claimText: "Partial magnetic levitation observed over permanent NdFeB magnets at ambient conditions.",
      status: "VERIFIED",
      confidence: 96.8,
      evidenceCount: 12,
      supportingSourcesCount: 10,
      supportingSources: [
        {
          title: "Max Planck Institute: Single Crystal levitation observations",
          source: "Nature Materials",
          url: "https://nature.com",
          reliability: 99.2,
        },
        {
          title: "Peking University CMDTC Crystallography Report",
          source: "arXiv:2308.05222",
          url: "https://arxiv.org",
          reliability: 97.5,
        },
      ],
      contradictingSources: [
        {
          title: "Initial unverified social media claims of 100% full suspension",
          source: "X / Twitter Pre-print Speculation",
          url: "https://x.com",
          flaw: "Exaggerated full flux-pinning suspension when measurements show partial diamagnetic tilt.",
        },
      ],
      reasoning: "Confirmed diamagnetic repulsion resulting from lead-apatite structural distortion. Verified across 10 independent institutional laboratories.",
      aiExplanation: "The observed levitation is genuine but represents diamagnetism rather than zero-resistance superconducting flux quantum pinning.",
      citations: ["Nature Materials doi:10.1038/s41563-024-01890-x", "arXiv:2308.05222 [cond-mat]"],
      confidenceHistory: [
        { timestamp: "0.0s", score: 50.0 },
        { timestamp: "1.0s", score: 78.4 },
        { timestamp: "2.0s", score: 96.8 },
      ],
    },
    {
      id: "claim-2",
      claimText: "Material exhibits zero electrical resistance at temperatures up to 400K (127°C).",
      status: "CONTRADICTED",
      confidence: 18.4,
      evidenceCount: 18,
      supportingSourcesCount: 1,
      supportingSources: [
        {
          title: "Original Pre-print Draft (Lee et al.)",
          source: "arXiv:2307.12008",
          url: "https://arxiv.org",
          reliability: 62.0,
        },
      ],
      contradictingSources: [
        {
          title: "Physical Review B: Electrical Transport Four-Point Probe Audit",
          source: "Physical Review B",
          url: "https://aps.org",
          flaw: "Probed non-zero electrical resistivity at all temperatures down to 4K.",
        },
        {
          title: "IEEE Xplore: Calibrated Contact Measurement Noise Analysis",
          source: "IEEE Transactions",
          url: "https://ieee.org",
          flaw: "Identified contact resistance thermal artifacts mimicking zero voltage drop.",
        },
      ],
      reasoning: "Resistivity drops near 377K stem from Cu2S structural phase transition, not zero-resistance bulk superconductivity.",
      aiExplanation: "This claim is contradicted by 18 peer-reviewed four-point probe measurements across international national labs.",
      citations: ["Physical Review B 108, 174501", "IEEE Trans. Appl. Supercond. 34, 4"],
      confidenceHistory: [
        { timestamp: "0.0s", score: 85.0 },
        { timestamp: "1.5s", score: 42.0 },
        { timestamp: "3.0s", score: 18.4 },
      ],
    },
    {
      id: "claim-3",
      claimText: "Copper sulfide (Cu2S) impurities account for first-order thermal phase transitions.",
      status: "VERIFIED",
      confidence: 98.2,
      evidenceCount: 15,
      supportingSourcesCount: 14,
      supportingSources: [
        {
          title: "Argonne National Laboratory X-Ray Diffraction Analysis",
          source: "DOE Materials Registry",
          url: "https://energy.gov",
          reliability: 99.8,
        },
        {
          title: "University of Maryland CMDTC Thermodynamics Audit",
          source: "Physical Review Letters",
          url: "https://aps.org",
          reliability: 98.9,
        },
      ],
      contradictingSources: [],
      reasoning: "Stoichiometric analysis confirms Cu2S impurities undergo a sharp resistivity drop at 104°C.",
      aiExplanation: "Universal agreement across national labs confirms Cu2S phase transition as the true mechanism behind anomalous thermal signals.",
      citations: ["DOE Materials Record #MP-98421", "Phys. Rev. Lett. 131, 256001"],
      confidenceHistory: [
        { timestamp: "0.0s", score: 60.0 },
        { timestamp: "1.0s", score: 88.0 },
        { timestamp: "2.0s", score: 98.2 },
      ],
    },
    {
      id: "claim-4",
      claimText: "Quantum surface-code error rates fall below the 10^-4 fault-tolerant physical threshold.",
      status: "PARTIALLY_VERIFIED",
      confidence: 84.6,
      evidenceCount: 8,
      supportingSourcesCount: 6,
      supportingSources: [
        {
          title: "Nature Physics: Surface code logical qubit lifetime benchmark",
          source: "Nature Physics",
          url: "https://nature.com",
          reliability: 97.0,
        },
      ],
      contradictingSources: [
        {
          title: "IBM Quantum Hardware Report: Scalability Overheads",
          source: "arXiv:2501.0982",
          url: "https://arxiv.org",
          flaw: "Achieved threshold in 2D grids, but requires 10,000 physical qubits per logical qubit.",
        },
      ],
      reasoning: "Threshold achieved in isolated 17-qubit distance-3 surface codes, but scaling to distance-7 remains unverified.",
      aiExplanation: "Partially verified: valid for small physical qubit clusters, but unverified for fault-tolerant multi-logical-qubit systems.",
      citations: ["Nature Physics 20, 412–418 (2024)"],
      confidenceHistory: [
        { timestamp: "0.0s", score: 50.0 },
        { timestamp: "1.0s", score: 72.0 },
        { timestamp: "2.0s", score: 84.6 },
      ],
    },
  ];

  const [claims, setClaims] = useState<ClaimItem[]>(initialClaims);
  const [expandedId, setExpandedId] = useState<string | null>("claim-1");
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [currentVerifyingIndex, setCurrentVerifyingIndex] = useState<number | null>(null);

  const handleRunVerificationAnimation = () => {
    setIsVerifyingAll(true);
    setCurrentVerifyingIndex(0);

    // Reset verification states
    setClaims((prev) =>
      prev.map((c) => ({
        ...c,
        isVerifying: true,
      }))
    );

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < initialClaims.length) {
        const currentIdx = idx;
        setCurrentVerifyingIndex(currentIdx);
        setClaims((prev) =>
          prev.map((c, i) =>
            i === currentIdx ? { ...c, isVerifying: false } : c
          )
        );
        idx++;
      } else {
        clearInterval(interval);
        setIsVerifyingAll(false);
        setCurrentVerifyingIndex(null);
      }
    }, 1500);
  };

  const getStatusBadge = (status: ClaimItem["status"]) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>VERIFIED (95%+)</span>
          </span>
        );
      case "PARTIALLY_VERIFIED":
        return (
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>PARTIALLY VERIFIED</span>
          </span>
        );
      case "CONTRADICTED":
        return (
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>CONTRADICTED</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 text-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Explainable AI Verification Audit</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Claim-by-Claim Verification Timeline
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Every atomic claim extracted from the research query is rigorously scrubbed against peer-reviewed datasets.
          </p>
        </div>

        <button
          onClick={handleRunVerificationAnimation}
          disabled={isVerifyingAll}
          className="px-6 py-3 bg-[#4F46E5] text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20"
        >
          {isVerifyingAll ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin text-white" />
              <span>Auditing Claim #{currentVerifyingIndex !== null ? currentVerifyingIndex + 1 : 1}...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Run Live Claim-by-Claim Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Vertical Timeline List */}
      <div className="relative space-y-6 before:absolute before:left-6 before:top-6 before:bottom-6 before:w-0.5 before:bg-gray-200">
        {claims.map((claim, idx) => {
          const isExpanded = expandedId === claim.id;
          const isCurrentlyVerifying = currentVerifyingIndex === idx;

          return (
            <div
              key={claim.id}
              className="relative pl-14 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {/* Timeline Bullet Marker */}
              <div
                className={`absolute left-2.5 top-5 w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-sm transition-all z-10 ${
                  claim.status === "VERIFIED"
                    ? "bg-emerald-500 border-emerald-300 text-white"
                    : claim.status === "PARTIALLY_VERIFIED"
                    ? "bg-amber-500 border-amber-300 text-white"
                    : "bg-rose-500 border-rose-300 text-white"
                }`}
              >
                {idx + 1}
              </div>

              {/* Main Card */}
              <div className="glass-card glass-card-hover rounded-2xl p-6 border border-gray-200 bg-white shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {getStatusBadge(claim.status)}
                    <span className="text-xs font-mono text-gray-500">
                      {claim.evidenceCount} Sources Consulted • {claim.supportingSourcesCount} Supporting
                    </span>
                  </div>

                  {/* Confidence Gauge */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">
                        Veracity Score
                      </span>
                      <span
                        className={`text-lg font-extrabold ${
                          claim.confidence >= 90
                            ? "text-emerald-600"
                            : claim.confidence >= 70
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}
                      >
                        {claim.confidence}%
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors border border-gray-200"
                      title="Expand Claim Details"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Claim Statement */}
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  "{claim.claimText}"
                </h3>

                {/* Progress Bar during active verification */}
                {isCurrentlyVerifying && (
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between font-mono animate-pulse">
                    <span className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 animate-spin text-[#4F46E5]" />
                      Cross-referencing 18 DOI ledgers in real time...
                    </span>
                    <span className="font-bold">Scrubbing...</span>
                  </div>
                )}

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="pt-4 border-t border-gray-200 space-y-6 animate-in fade-in duration-300">
                    {/* Reasoning & AI Explanation */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Deductive Reasoning & Explanation
                      </h4>
                      <p className="text-xs text-gray-800 leading-relaxed font-sans">{claim.reasoning}</p>
                      <p className="text-xs text-gray-600 italic pt-1 font-sans">
                        "{claim.aiExplanation}"
                      </p>
                    </div>

                    {/* Supporting & Contradicting Sources Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Supporting */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Supporting Evidence ({claim.supportingSources.length})
                        </h4>
                        <div className="space-y-2">
                          {claim.supportingSources.map((sup, i) => (
                            <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                              <p className="font-bold text-gray-900 leading-tight">{sup.title}</p>
                              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                                <span>{sup.source}</span>
                                <span className="text-emerald-700 font-bold font-mono">
                                  {sup.reliability}% Trust
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contradicting */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-rose-700 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          Contradicting Sources / Flaws ({claim.contradictingSources.length})
                        </h4>
                        <div className="space-y-2">
                          {claim.contradictingSources.length === 0 ? (
                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 italic">
                              No contradicting sources found in literature.
                            </div>
                          ) : (
                            claim.contradictingSources.map((con, i) => (
                              <div key={i} className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1">
                                <p className="font-bold text-gray-900 leading-tight">{con.title}</p>
                                <p className="text-[11px] text-rose-800">{con.flaw}</p>
                                <span className="text-[10px] text-gray-500 block pt-1">{con.source}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Citations Footer */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-500">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#4F46E5]" />
                        <span>Footnotes: {claim.citations.join(" • ")}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
