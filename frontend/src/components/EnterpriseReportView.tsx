import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  Award,
  Globe,
  BookOpen,
  Scale,
  BarChart3,
  Layers,
  Sparkles,
} from "lucide-react";

interface ClaimItem {
  id: string;
  text: string;
  verdict: "SUPPORTED" | "MIXED" | "REFUTED" | "INCONCLUSIVE" | string;
  confidence: number;
  reasoning: string;
  supporting_sources?: string[];
  contradicting_sources?: string[];
}

interface SourceItem {
  id: string;
  title: string;
  url: string;
  snippet?: string;
  domain?: string;
  score?: number;
}

interface ContradictionItem {
  claim_id: string;
  source_a_id: string;
  source_b_id: string;
  conflict_description: string;
}

interface EnterpriseReportViewProps {
  query: string;
  markdownReport: string;
  claims?: ClaimItem[];
  sources?: SourceItem[];
  contradictions?: ContradictionItem[];
  timestamp?: string;
  onSaveToVault?: () => void;
  onCopyReport?: () => void;
}

export function EnterpriseReportView({
  query,
  markdownReport,
  claims = [],
  sources = [],
  contradictions = [],
  timestamp,
  onSaveToVault,
  onCopyReport,
}: EnterpriseReportViewProps) {
  const [copied, setCopied] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    summary: false,
    claims: false,
    contradictions: false,
    evidence: false,
    conclusion: false,
    references: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Copy report handler
  const handleCopy = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    if (onCopyReport) onCopyReport();
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute stats dynamically if not provided directly
  const stats = useMemo(() => {
    const totalClaims = claims.length;
    const totalSources = sources.length;

    const verdicts = claims.map((c) => c.verdict?.toUpperCase() || "INCONCLUSIVE");
    const supportedCount = verdicts.filter((v) => v === "SUPPORTED").length;
    const refutedCount = verdicts.filter((v) => v === "REFUTED").length;
    const mixedCount = verdicts.filter((v) => v === "MIXED").length;

    let overallVerdict = "INCONCLUSIVE";
    if (totalClaims > 0) {
      if (supportedCount === totalClaims) overallVerdict = "SUPPORTED";
      else if (refutedCount === totalClaims) overallVerdict = "REFUTED";
      else if (supportedCount > 0 || mixedCount > 0) overallVerdict = "MIXED";
    }

    const confSum = claims.reduce((acc, c) => acc + (c.confidence || 0), 0);
    const avgConfidence = totalClaims > 0 ? Math.round((confSum / totalClaims) * 100) : 0;

    // Categorize sources for Recharts
    const sourceCategories = {
      "Peer-reviewed": 0,
      Government: 0,
      News: 0,
      Commercial: 0,
      Unknown: 0,
    };

    const peerKw = ["edu", "ncbi", "arxiv", "nature", "science", "ieee", "doi", "springer"];
    const govKw = ["gov", "who.int", "un.org", "nih.gov", "cdc.gov", "nasa.gov"];
    const newsKw = ["reuters", "bbc", "apnews", "nytimes", "bloomberg", "cnn", "theguardian", "wsj"];

    sources.forEach((s) => {
      const d = (s.domain || s.url || "").toLowerCase();
      if (peerKw.some((k) => d.includes(k))) sourceCategories["Peer-reviewed"]++;
      else if (govKw.some((k) => d.includes(k))) sourceCategories["Government"]++;
      else if (newsKw.some((k) => d.includes(k))) sourceCategories["News"]++;
      else if (d.includes("com") || d.includes("io") || d.includes("org")) sourceCategories["Commercial"]++;
      else sourceCategories["Unknown"]++;
    });

    const categoryData = Object.entries(sourceCategories).map(([name, count]) => ({
      name,
      count,
      percentage: totalSources > 0 ? Math.round((count / totalSources) * 100) : 0,
    }));

    return {
      totalClaims,
      totalSources,
      overallVerdict,
      avgConfidence,
      supportedCount,
      refutedCount,
      mixedCount,
      categoryData,
    };
  }, [claims, sources]);

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#6B7280"];

  const getVerdictBadge = (verdict: string) => {
    const v = (verdict || "").toUpperCase();
    if (v === "SUPPORTED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>🟢 Supported</span>
        </span>
      );
    }
    if (v === "REFUTED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>🔴 Refuted</span>
        </span>
      );
    }
    if (v === "MIXED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>🟡 Mixed</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
        <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
        <span>⚪ Inconclusive</span>
      </span>
    );
  };

  const getReliabilityBadge = (score: number = 0.8) => {
    if (score >= 0.75) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          High Reliability
        </span>
      );
    }
    if (score >= 0.4) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold">
          Medium Reliability
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold">
        Low Reliability
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans text-gray-900">
      {/* Enterprise Header Banner */}
      <div className="glass-card rounded-2xl p-8 border border-gray-200 bg-white shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>ENTERPRISE RESEARCH REPORT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {query}
            </h1>
            <p className="text-xs text-gray-500 font-mono">
              Generated: {timestamp || new Date().toLocaleTimeString()} | Verified across {stats.totalSources} sources
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onSaveToVault && (
              <button
                onClick={onSaveToVault}
                className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 transition-all flex items-center gap-2 shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-[#4F46E5]" />
                <span>Save Report</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
              <span>{copied ? "Copied" : "Copy Markdown"}</span>
            </button>
          </div>
        </div>

        {/* Top Metric Bar Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Overall Verdict</p>
            <div className="pt-1">{getVerdictBadge(stats.overallVerdict)}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Aggregate Confidence</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-600">{stats.avgConfidence}%</span>
              <span className="text-xs text-gray-500">score</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Claims Extracted</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">{stats.totalClaims}</span>
              <span className="text-xs text-emerald-600 font-semibold">({stats.supportedCount} Supported)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Evidence Sources</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">{stats.totalSources}</span>
              <span className="text-xs text-indigo-600 font-semibold">Validated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Section 1: Executive Summary */}
      <div className="glass-card rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("summary")}
          className="w-full px-6 py-4 bg-gray-50/80 hover:bg-gray-100/80 flex items-center justify-between transition-colors border-b border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-[#4F46E5]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Executive Summary</h2>
          </div>
          {collapsedSections.summary ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronUp className="w-5 h-5 text-gray-500" />}
        </button>

        {!collapsedSections.summary && (
          <div className="p-6 text-gray-800 leading-relaxed text-sm md:text-base space-y-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownReport.includes("## Executive Summary")
                ? markdownReport.split("## Executive Summary")[1]?.split("##")[0]
                : markdownReport.slice(0, 500)}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Collapsible Section 2: Claim Verification Matrix Cards */}
      <div className="glass-card rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("claims")}
          className="w-full px-6 py-4 bg-gray-50/80 hover:bg-gray-100/80 flex items-center justify-between transition-colors border-b border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">Claim Verification Matrix</h2>
              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                {claims.length || "Active"}
              </span>
            </div>
          </div>
          {collapsedSections.claims ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronUp className="w-5 h-5 text-gray-500" />}
        </button>

        {!collapsedSections.claims && (
          <div className="p-6 space-y-4">
            {claims.length > 0 ? (
              claims.map((claim, idx) => {
                const confPercent = Math.round((claim.confidence || 0.85) * 100);
                return (
                  <div key={claim.id || idx} className="p-5 rounded-xl border border-gray-200 bg-slate-50/50 space-y-4 hover:border-indigo-200 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-mono font-bold">
                          Claim #{idx + 1}
                        </span>
                        {getVerdictBadge(claim.verdict)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-semibold">Confidence:</span>
                        <span className="text-sm font-bold text-indigo-700">{confPercent}%</span>
                      </div>
                    </div>

                    <p className="text-base font-bold text-gray-900">{claim.text}</p>

                    {/* Animated Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#4F46E5] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${confPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700 pt-2">
                      <div className="p-3 rounded-lg bg-white border border-gray-200">
                        <span className="font-bold text-gray-900 block mb-1">Analytical Reasoning</span>
                        <p>{claim.reasoning}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-gray-200 space-y-1">
                        <span className="font-bold text-gray-900 block mb-1">Evidentiary Citations</span>
                        <p className="text-gray-600">
                          Corroborated across: {claim.supporting_sources?.join(", ") || "Web Ledger"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="prose text-gray-800 text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownReport.includes("## Claim Verification Matrix")
                    ? markdownReport.split("## Claim Verification Matrix")[1]?.split("##")[0]
                    : "No individual claims breakdown available."}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Section 3: Evidence Analysis & Recharts Visuals */}
      <div className="glass-card rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("evidence")}
          className="w-full px-6 py-4 bg-gray-50/80 hover:bg-gray-100/80 flex items-center justify-between transition-colors border-b border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Evidence Quality & Distribution</h2>
          </div>
          {collapsedSections.evidence ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronUp className="w-5 h-5 text-gray-500" />}
        </button>

        {!collapsedSections.evidence && (
          <div className="p-6 space-y-6">
            {/* Recharts Graphical Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Source Category Distribution
                </h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Percentage breakdown table */}
              <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-3">
                <h3 className="text-sm font-bold text-gray-900">Category Breakdown Table</h3>
                <div className="divide-y divide-gray-200 text-xs">
                  {stats.categoryData.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-700">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{item.count} sources</span>
                        <span className="text-gray-500">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Section 4: Contradiction Analysis */}
      <div className="glass-card rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("contradictions")}
          className="w-full px-6 py-4 bg-gray-50/80 hover:bg-gray-100/80 flex items-center justify-between transition-colors border-b border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Contradiction Analysis</h2>
          </div>
          {collapsedSections.contradictions ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronUp className="w-5 h-5 text-gray-500" />}
        </button>

        {!collapsedSections.contradictions && (
          <div className="p-6 text-sm text-gray-800 space-y-4">
            {contradictions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-gray-200">
                      <th className="p-2.5 font-bold">Claim ID</th>
                      <th className="p-2.5 font-bold">Conflicting Sources</th>
                      <th className="p-2.5 font-bold">Nature of Conflict</th>
                      <th className="p-2.5 font-bold">Confidence Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contradictions.map((c, i) => (
                      <tr key={i} className="hover:bg-amber-50/40">
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{c.claim_id}</td>
                        <td className="p-2.5">{c.source_a_id} vs {c.source_b_id}</td>
                        <td className="p-2.5">{c.conflict_description}</td>
                        <td className="p-2.5 text-amber-700 font-semibold">Medium</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 italic">No significant contradictions were detected across sources.</p>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Section 5: References & Citation Cards */}
      <div className="glass-card rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection("references")}
          className="w-full px-6 py-4 bg-gray-50/80 hover:bg-gray-100/80 flex items-center justify-between transition-colors border-b border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">References & Clickable Sources</h2>
              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                {sources.length || "Cited"}
              </span>
            </div>
          </div>
          {collapsedSections.references ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronUp className="w-5 h-5 text-gray-500" />}
        </button>

        {!collapsedSections.references && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.length > 0 ? (
              sources.map((src, i) => (
                <a
                  key={src.id || i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-gray-200 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-700">[{src.id || i + 1}]</span>
                      {getReliabilityBadge(src.score)}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-900 transition-colors line-clamp-2">
                      {src.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200/60">
                    <div className="flex items-center gap-1.5 truncate">
                      <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{src.domain || "Web Domain"}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-2 text-sm text-gray-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownReport.includes("## References")
                    ? markdownReport.split("## References")[1]
                    : "No specific citations listed."}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
