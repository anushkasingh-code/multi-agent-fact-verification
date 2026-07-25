import { useState } from "react";
import { ShaderBackground } from "./ShaderBackground";
import { NavigationTab } from "../types";
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Users,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Activity,
  Layers,
  Database,
  Cpu,
  Download,
  FileCode,
  Printer,
  FileJson,
  Sliders,
  CheckSquare,
  Square,
  Award,
  Globe,
  AlertTriangle,
} from "lucide-react";

interface DashboardViewProps {
  onTabChange: (tab: NavigationTab) => void;
  onOpenDemo: () => void;
}

export function DashboardView({ onTabChange, onOpenDemo }: DashboardViewProps) {
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number | null>(null);

  // Export Feature State
  const sampleExportReports = [
    {
      id: "report-qec",
      title: "Quantum Error Correction Fault-Tolerance & Surface Code Benchmarks",
      topic: "Quantum Computing & Error Mitigation",
      confidenceScore: 97.8,
      status: "HIGH VERACITY VERIFIED",
      hallucinationsCount: 2,
      sourcesCount: 18,
      timestamp: "2026-07-24",
      summary:
        "Multi-agent synthesis of 18 peer-reviewed hardware telemetry datasets proves surface-code fault-tolerance error rates fall below 10^-4 in 17-qubit distance-3 grids across Google Sycamore and IBM Eagle. Isolated 2 speculative extrapolations regarding zero-overhead multi-logical routing.",
      findings: [
        "Physical qubit error rates achieved 8.4 x 10^-5 per gate cycle on 2D transmon architecture.",
        "Logical qubit lifetime exceeded physical constituent lifetimes by 2.4x under active syndrome extraction.",
        "Scaling to distance-7 logical qubits requires 10,000 physical qubits per fault-tolerant node.",
      ],
      citations: [
        { ref: "[1]", title: "Nature Physics: Logical Qubit Lifetime Benchmarks", source: "Nature Physics", doi: "doi:10.1038/s41567-024-02381-x", url: "https://nature.com" },
        { ref: "[2]", title: "IBM Quantum Hardware Scaling Audit", source: "arXiv Pre-print", doi: "arXiv:2501.0982", url: "https://arxiv.org" },
        { ref: "[3]", title: "IEEE Transactions on Quantum Engineering", source: "IEEE Xplore", doi: "doi:10.1109/TQE.2025.3412901", url: "https://ieee.org" },
      ],
      auditLogs: [
        "[Analyst Agent]: Deconstructed query into 3 atomic error threshold claims.",
        "[Scraper Agent]: Harvested 18 peer-reviewed datasets from Nature & IEEE.",
        "[Logic Critic]: Isolated 2 unverified hardware extrapolation claims.",
        "[Fact Validator]: Matched remaining claims against DOI ledger.",
      ],
    },
    {
      id: "report-lk99",
      title: "LK-99 Room-Temperature Superconductivity Re-evaluation & Replication",
      topic: "Solid State Physics & Materials Science",
      confidenceScore: 91.4,
      status: "VERIFIED WITH RESERVATIONS",
      hallucinationsCount: 3,
      sourcesCount: 24,
      timestamp: "2026-07-22",
      summary:
        "Comprehensive cross-verification across 24 international replication studies confirms partial magnetic levitation originates from copper sulfide (Cu2S) phase transitions and ferromagnetism rather than bulk ambient superconductivity.",
      findings: [
        "Resistivity drops at 377K stem from Cu2S first-order structural transition, mimicking superconductivity.",
        "High-purity single crystals synthesized at Max Planck Institute were insulating with high resistivity.",
        "Zero electrical resistance claims refuted by 18 independent four-point probe measurements.",
      ],
      citations: [
        { ref: "[1]", title: "Max Planck Institute: Pure Single Crystal Lead Apatite Synthesis", source: "Nature Materials", doi: "doi:10.1038/s41563-024-01890-x", url: "https://nature.com" },
        { ref: "[2]", title: "Physical Review B: Transport Properties Four-Point Probe Audit", source: "Physical Review B", doi: "108, 174501", url: "https://aps.org" },
        { ref: "[3]", title: "Argonne National Lab: DOE Materials Registry #MP-98421", source: "US Department of Energy", doi: "DOE-MP-98421", url: "https://energy.gov" },
      ],
      auditLogs: [
        "[Analyst Agent]: Parsed zero-resistance & levitation claims.",
        "[Scraper Agent]: Ingested 24 international replication studies.",
        "[Logic Critic]: Flagged Cu2S impurity confusion artifact.",
        "[Fact Validator]: Final veracity index assigned at 91.4%.",
      ],
    },
  ];

  const [selectedReport, setSelectedReport] = useState(sampleExportReports[0]);
  const [exportFormat, setExportFormat] = useState<"markdown" | "pdf" | "json">("markdown");
  const [includeConfidence, setIncludeConfidence] = useState(true);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [includeAuditLogs, setIncludeAuditLogs] = useState(true);
  const [exportCopied, setExportCopied] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const hallucinationImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDav8Y4XXmvw5jLlSh2MsIjZBmu5XNx_93WSGO6XlHI-H-GovcS3r1Swn3XxGoj1mmtP_nPZNm5by4WK_ujOR5N4rak4TNTpppn1UAfMNeq2oy7VDC4-r2YuFaGvCP6w8Q_5M7fI59BZLbY6EvYAfBvcVEOb2ov2ph84edTQQpUau93ntL4YmkpjHAGpry3VWxbSqrU45rIAsZ1fgSikNbHdBbyVtIQMoQ0f0Lsp9BmLljWgVstdpYk1RJwuBjDV7MayOhoSr9eOAHo";

  const agentNetworkImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCTzYzg3nCMm8De78_aTJYrPgyPXvYUSwt3UPbRpYkQG6SqDa1cC0lpvDfrADv2MEYDlOzQJzQDqkWLl840zTqPxaBI8_JmoxaE_TdEdarn5e4jaP4eg3OiQXRUd4CgR0LT2LFjygjGO9NtBfOAdQpKiip_eBYxiuSftQdQYuJsPwnfrwVO0uJGO07yFqnMcYI_rmbCV72CbmkGsD4an3FQZH2TL0bUSkEiBhz6_xW-L_I8AJyHwuPzyWbp-6CBaM5BpjP7RNp9BzY3";

  const handleCopyCitation = () => {
    navigator.clipboard.writeText("[Ref 12] IEEE Explorer: Neural Optimization (2024)");
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  // Generate Markdown string
  const generateMarkdownString = () => {
    let md = `# ${selectedReport.title}\n\n`;
    md += `**Topic:** ${selectedReport.topic}  \n`;
    md += `**Generated Date:** ${selectedReport.timestamp}  \n`;

    if (includeConfidence) {
      md += `\n> **VERISPHERE RESEARCH CONFIDENCE SCORE:** ${selectedReport.confidenceScore}% (${selectedReport.status})  \n`;
      md += `> **Primary Sources Consulted:** ${selectedReport.sourcesCount} | **Hallucinations Isolated:** ${selectedReport.hallucinationsCount}\n\n`;
    }

    md += `## Executive Summary\n${selectedReport.summary}\n\n`;

    md += `## Key Verified Findings\n`;
    selectedReport.findings.forEach((finding, idx) => {
      md += `${idx + 1}. ${finding}\n`;
    });
    md += `\n`;

    if (includeCitations && selectedReport.citations.length > 0) {
      md += `## Footnote Citation Ledger\n`;
      selectedReport.citations.forEach((cite) => {
        md += `- **${cite.ref} ${cite.title}** - *${cite.source}* (${cite.doi})\n`;
      });
      md += `\n`;
    }

    if (includeAuditLogs && selectedReport.auditLogs.length > 0) {
      md += `## Agent Swarm Audit Trail\n\`\`\`text\n`;
      selectedReport.auditLogs.forEach((log) => {
        md += `${log}\n`;
      });
      md += `\`\`\`\n`;
    }

    md += `\n---\n*Report compiled via VeriSphere Autonomous Multi-Agent Swarm Protocol.*`;
    return md;
  };

  // Handle Export Markdown File Download
  const handleExportMarkdown = () => {
    const mdContent = generateMarkdownString();
    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedReport.id}-verisphere-report.md`;
    link.click();
    URL.revokeObjectURL(url);

    setExportSuccessMsg("Markdown report (.md) downloaded successfully!");
    setTimeout(() => setExportSuccessMsg(null), 3500);
  };

  // Handle Export JSON Data Download
  const handleExportJSON = () => {
    const exportData = {
      reportTitle: selectedReport.title,
      topic: selectedReport.topic,
      generatedDate: selectedReport.timestamp,
      ...(includeConfidence && {
        confidenceScore: selectedReport.confidenceScore,
        veracityStatus: selectedReport.status,
        hallucinationsIsolated: selectedReport.hallucinationsCount,
        sourcesConsulted: selectedReport.sourcesCount,
      }),
      summary: selectedReport.summary,
      findings: selectedReport.findings,
      ...(includeCitations && { citations: selectedReport.citations }),
      ...(includeAuditLogs && { swarmAuditLogs: selectedReport.auditLogs }),
      meta: {
        engine: "VeriSphere Autonomous Swarm",
        version: "2026.4.1",
      },
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedReport.id}-verisphere-report.json`;
    link.click();
    URL.revokeObjectURL(url);

    setExportSuccessMsg("Structured JSON data (.json) downloaded successfully!");
    setTimeout(() => setExportSuccessMsg(null), 3500);
  };

  // Handle PDF Print Export
  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to generate PDF print output.");
      return;
    }

    const citationsHTML = includeCitations
      ? `
      <div style="margin-top: 30px; border-top: 2px solid #333; padding-top: 15px;">
        <h3 style="color: #4b0082; margin-bottom: 10px;">Footnote Citation Ledger (${selectedReport.citations.length})</h3>
        <ul style="list-style: none; padding-left: 0;">
          ${selectedReport.citations
            .map(
              (c) => `
            <li style="margin-bottom: 8px; padding: 8px; background: #f8f9fa; border-radius: 6px; font-size: 13px;">
              <strong>${c.ref} ${c.title}</strong> — <em>${c.source}</em> (${c.doi})
            </li>`
            )
            .join("")}
        </ul>
      </div>`
      : "";

    const auditHTML = includeAuditLogs
      ? `
      <div style="margin-top: 25px; background: #111; color: #00ffcc; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px;">
        <h4 style="color: #fff; margin-top: 0;">Swarm Agent Audit Trail</h4>
        ${selectedReport.auditLogs.map((l) => `<div>${l}</div>`).join("")}
      </div>`
      : "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedReport.title} - VeriSphere Report</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; max-w: 800px; margin: 0 auto; }
            .header { border-bottom: 3px solid #7c3aed; padding-bottom: 15px; margin-bottom: 25px; }
            .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; }
            .confidence-box { background: #f0fdf4; border: 2px solid #22c55e; padding: 15px; border-radius: 10px; margin: 20px 0; }
            .confidence-score { font-size: 28px; font-weight: 900; color: #15803d; }
            h1 { font-size: 24px; color: #1e1b4b; margin-top: 10px; }
            h2 { font-size: 18px; color: #4338ca; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            ul.findings { padding-left: 20px; }
            ul.findings li { margin-bottom: 8px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #eee; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="badge">VERISPHERE MULTI-AGENT RESEARCH AUDIT</span>
            <h1>${selectedReport.title}</h1>
            <p style="color: #666; font-size: 13px;">Topic: ${selectedReport.topic} • Date: ${selectedReport.timestamp}</p>
          </div>

          ${
            includeConfidence
              ? `
          <div class="confidence-box">
            <span style="font-size: 12px; color: #166534; font-weight: bold; text-transform: uppercase;">Overall Veracity Rating</span>
            <div class="confidence-score">${selectedReport.confidenceScore}% (${selectedReport.status})</div>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #15803d;">
              ${selectedReport.sourcesCount} Primary Sources Consulted • ${selectedReport.hallucinationsCount} Model Hallucinations Isolated
            </p>
          </div>`
              : ""
          }

          <h2>Executive Summary</h2>
          <p>${selectedReport.summary}</p>

          <h2>Key Verified Findings</h2>
          <ul class="findings">
            ${selectedReport.findings.map((f) => `<li><strong>${f}</strong></li>`).join("")}
          </ul>

          ${citationsHTML}
          ${auditHTML}

          <div class="footer">
            Generated via VeriSphere Autonomous Research Swarm • Certified Digital Audit
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();

    setExportSuccessMsg("Opening structured PDF print dialog...");
    setTimeout(() => setExportSuccessMsg(null), 3500);
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownString();
    navigator.clipboard.writeText(md);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen text-gray-900 overflow-hidden pb-16">
      {/* WebGL Shader Background */}
      <ShaderBackground />

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-12 max-w-5xl mx-auto">
        <div className="space-y-8 max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
            <span>Enterprise Research Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
            Autonomous Multi-Agent <br className="hidden md:block" /> Research & Fact Verification
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Deploy specialized AI agents that collaborate in real-time to synthesize data, verify facts across primary sources, and eliminate model hallucinations.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onTabChange("collaboration")}
              className="px-6 py-3.5 bg-[#4F46E5] text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm"
            >
              <Users className="w-4 h-4 text-white" />
              <span>Watch Agent Swarm Live</span>
            </button>
            <button
              onClick={() => onTabChange("graph")}
              className="px-6 py-3.5 bg-white border border-gray-300 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50/50 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Knowledge Graph</span>
            </button>
            <button
              onClick={() => onTabChange("timeline")}
              className="px-6 py-3.5 bg-white border border-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-xs"
            >
              <span>Claims Timeline</span>
            </button>
            <button
              onClick={() => onTabChange("confidence")}
              className="px-6 py-3.5 bg-white border border-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-xs"
            >
              <span>Confidence Center</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED EXPORT REPORT SECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="glass-card rounded-3xl p-8 border border-gray-200 relative overflow-hidden shadow-lg bg-white/90 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
                <Download className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Export & Report Publisher</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                Export Research Report
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Download current research reports as structured PDF documents, Markdown (.md) files, or JSON audit logs, complete with confidence scores and footnoted citations.
              </p>
            </div>

            {/* Select Active Report Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase block">
                Select Active Report:
              </label>
              <select
                value={selectedReport.id}
                onChange={(e) => {
                  const rep = sampleExportReports.find((r) => r.id === e.target.value);
                  if (rep) setSelectedReport(rep);
                }}
                className="px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4F46E5] shadow-xs"
              >
                {sampleExportReports.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.confidenceScore}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Export Toast Alert */}
          {exportSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-300 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{exportSuccessMsg}</span>
            </div>
          )}

          {/* Report Live Preview & Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls & Customization Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Format Switcher */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-500 uppercase block">
                  1. Choose Export Format
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setExportFormat("markdown")}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      exportFormat === "markdown"
                        ? "bg-[#4F46E5] text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <FileCode className="w-4 h-4" />
                    <span>Markdown (.md)</span>
                  </button>

                  <button
                    onClick={() => setExportFormat("pdf")}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      exportFormat === "pdf"
                        ? "bg-[#4F46E5] text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <Printer className="w-4 h-4" />
                    <span>PDF Print</span>
                  </button>

                  <button
                    onClick={() => setExportFormat("json")}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      exportFormat === "json"
                        ? "bg-[#4F46E5] text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <FileJson className="w-4 h-4" />
                    <span>JSON Data</span>
                  </button>
                </div>
              </div>

              {/* Customization Toggles */}
              <div className="space-y-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#06B6D4]" />
                  2. Customize Included Metadata
                </span>

                <div className="space-y-2 text-xs font-medium">
                  <label
                    onClick={() => setIncludeConfidence(!includeConfidence)}
                    className="flex items-center gap-2.5 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    {includeConfidence ? (
                      <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                    <span>Include Veracity Score ({selectedReport.confidenceScore}%) & Status</span>
                  </label>

                  <label
                    onClick={() => setIncludeCitations(!includeCitations)}
                    className="flex items-center gap-2.5 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    {includeCitations ? (
                      <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                    <span>Include Footnotes & DOI Citation Ledger ({selectedReport.citations.length})</span>
                  </label>

                  <label
                    onClick={() => setIncludeAuditLogs(!includeAuditLogs)}
                    className="flex items-center gap-2.5 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    {includeAuditLogs ? (
                      <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                    <span>Include Swarm Agent Execution Audit Logs</span>
                  </label>
                </div>
              </div>

              {/* Action Export Buttons */}
              <div className="space-y-2 pt-2">
                {exportFormat === "markdown" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportMarkdown}
                      className="flex-1 py-3.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Markdown File (.md)</span>
                    </button>
                    <button
                      onClick={handleCopyMarkdown}
                      className="px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded-xl border border-gray-300 transition-all flex items-center gap-1.5 shadow-xs"
                      title="Copy Markdown to Clipboard"
                    >
                      {exportCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{exportCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                )}

                {exportFormat === "pdf" && (
                  <button
                    onClick={handleExportPDF}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Generate Structured PDF / Print Document</span>
                  </button>
                )}

                {exportFormat === "json" && (
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-3.5 bg-[#06B6D4] hover:bg-cyan-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <FileJson className="w-4 h-4 text-white" />
                    <span>Download JSON Audit Log (.json)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Live Preview Column */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-sans text-xs text-slate-200 relative overflow-hidden max-h-[420px] overflow-y-auto shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-[11px] text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Live Report Export Document Preview
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{selectedReport.timestamp}</span>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white leading-tight">{selectedReport.title}</h3>
                <p className="text-[11px] text-slate-400 font-mono">Topic: {selectedReport.topic}</p>
              </div>

              {/* Confidence Score Callout */}
              {includeConfidence && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                      Veracity Rating
                    </span>
                    <span className="text-base font-black text-white">
                      {selectedReport.confidenceScore}% ({selectedReport.status})
                    </span>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                </div>
              )}

              {/* Summary */}
              <div className="space-y-1">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                  Executive Summary
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">{selectedReport.summary}</p>
              </div>

              {/* Findings */}
              <div className="space-y-1">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                  Key Verified Findings ({selectedReport.findings.length})
                </span>
                <ul className="space-y-1 list-disc list-inside text-slate-300 font-sans">
                  {selectedReport.findings.map((f, i) => (
                    <li key={i} className="leading-tight">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Citations Preview */}
              {includeCitations && (
                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <span className="font-bold text-indigo-300 uppercase text-[10px] tracking-wider block">
                    Footnote Citation Ledger ({selectedReport.citations.length})
                  </span>
                  <div className="space-y-1 font-mono text-[11px]">
                    {selectedReport.citations.map((c, i) => (
                      <div key={i} className="p-1.5 rounded bg-slate-800/60 text-slate-300 truncate">
                        <span className="text-indigo-300 font-bold mr-1">{c.ref}</span>
                        <span>{c.title}</span> — <span className="text-slate-400">{c.source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Swarm Audit Logs */}
              {includeAuditLogs && (
                <div className="space-y-1 pt-2 border-t border-slate-800 font-mono text-[10px] text-emerald-300">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">
                    Swarm Agent Audit Trail
                  </span>
                  {selectedReport.auditLogs.map((l, i) => (
                    <div key={i} className="truncate">
                      {l}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Feature 1: Hallucination Detection */}
          <div className="md:col-span-7 glass-card glass-card-hover rounded-2xl p-8 flex flex-col justify-between bg-white border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#06B6D4]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                Hallucination Detection
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Every output is cross-referenced against VeriSphere's internal verification engine. We identify and isolate model fantasies before they reach your report.
              </p>
            </div>

            <div className="mt-8 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative group shadow-xs">
              <img
                src={hallucinationImg}
                alt="Hallucination Detection Dashboard UI"
                className="w-full h-56 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              {/* Floating Gauge Overlay */}
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 backdrop-blur-md rounded-lg border border-gray-200 flex items-center justify-between text-xs shadow-md">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-gray-900">AI Confidence Score:</span>
                  <span className="text-emerald-600 font-bold">94.7% High Veracity Verified</span>
                </div>
                <div className="text-gray-500 font-mono hidden sm:block">Credibility Index: 982/1000</div>
              </div>
            </div>
          </div>

          {/* Feature 2: Autonomous Citation */}
          <div className="md:col-span-5 glass-card glass-card-hover rounded-2xl p-8 flex flex-col justify-between space-y-6 bg-white border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#4F46E5]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                Autonomous Citation
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Automated footnote generation with live links to primary documents, research papers, and verified datasets.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 font-mono text-xs text-indigo-900 flex items-center justify-between gap-3 group">
              <span className="truncate">
                [Ref 12] IEEE Explorer: Neural Optimization (2024)
              </span>
              <button
                onClick={handleCopyCitation}
                className="p-1.5 rounded-lg bg-white hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                title="Copy Citation"
              >
                {copiedCitation ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Feature 3: Multi-Agent Collaboration */}
          <div className="md:col-span-12 glass-card glass-card-hover rounded-2xl p-8 bg-white border border-gray-200 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Multi-Agent Collaboration
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Our proprietary Swarm Protocol allows dozens of specialized agents to work in parallel. An 'Analyst' agent pulls data, a 'Critic' agent challenges the logic, and a 'Synthesizer' agent crafts the final output.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-800 border border-gray-200">
                    Primary Researcher
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-800 border border-gray-200">
                    Logic Critic
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-800 border border-gray-200">
                    Fact Validator
                  </span>
                </div>
              </div>

              <div className="relative h-64 md:h-80 w-full rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden p-4 shadow-inner">
                <img
                  src={agentNetworkImg}
                  alt="Intelligent Agent Network Swarm Topology"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The VeriSphere Workflow */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            The VeriSphere Workflow
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base">
            See how our agents transform raw queries into verified insights through iterative collaboration.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden bg-white border border-gray-200 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Input Query",
                desc: "Simple prompts are expanded into complex research tasks.",
                icon: Layers,
                color: "text-indigo-600",
              },
              {
                step: 2,
                title: "Agent Deployment",
                desc: "Specialized sub-agents are spawned to gather disparate data.",
                icon: Cpu,
                color: "text-blue-600",
              },
              {
                step: 3,
                title: "Fact Scrubbing",
                desc: "Critical agents verify every claim against the global ledger.",
                icon: Activity,
                color: "text-cyan-600",
              },
              {
                step: 4,
                title: "Final Synthesis",
                desc: "A verified, cited, and formatted report is delivered.",
                icon: Database,
                color: "text-purple-600",
              },
            ].map((s) => {
              const StepIcon = s.icon;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveWorkflowStep(activeWorkflowStep === s.step ? null : s.step)}
                  className={`text-center space-y-4 p-4 rounded-2xl transition-all cursor-pointer ${
                    activeWorkflowStep === s.step
                      ? "bg-indigo-50 ring-2 ring-[#4F46E5]"
                      : "hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  }`}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-900 font-bold text-xl shadow-sm relative group">
                    <span>{s.step}</span>
                    <StepIcon className={`w-5 h-5 absolute -bottom-1 -right-1 ${s.color}`} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">{s.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

