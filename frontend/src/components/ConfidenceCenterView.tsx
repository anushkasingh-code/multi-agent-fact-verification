import { useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Award,
  BarChart3,
  TrendingUp,
  Sparkles,
  Zap,
  Globe,
  Database,
  ArrowUpRight,
} from "lucide-react";

export function ConfidenceCenterView() {
  const reportsData = [
    {
      id: "report-1",
      topic: "LK-99 Ambient Superconductivity Re-evaluation",
      overallScore: 91.4,
      status: "VERIFIED WITH RESERVATIONS",
      metrics: [
        {
          title: "Research Quality",
          score: 96.2,
          color: "text-emerald-700",
          gradientFrom: "#10b981",
          gradientTo: "#059669",
          icon: Award,
          explanation: "Indexed 18 primary datasets with high DOI citation impact factors.",
        },
        {
          title: "Source Agreement",
          score: 88.7,
          color: "text-indigo-700",
          gradientFrom: "#6366f1",
          gradientTo: "#4f46e5",
          icon: Globe,
          explanation: "Consensus agreement across 15 international material science labs.",
        },
        {
          title: "Citation Completeness",
          score: 99.1,
          color: "text-purple-700",
          gradientFrom: "#9333ea",
          gradientTo: "#7e22ce",
          icon: FileText,
          explanation: "100% of extracted claims backed by direct footnote citations.",
        },
        {
          title: "Hallucination Risk",
          score: 96.2, // Inverse risk score (96.2% safe = 3.8% risk)
          color: "text-emerald-800",
          gradientFrom: "#059669",
          gradientTo: "#047857",
          icon: ShieldCheck,
          explanation: "Isolated 2 model fantasies before final synthesis.",
        },
      ],
    },
    {
      id: "report-2",
      topic: "Quantum Error Correction Fault-Tolerance Audit",
      overallScore: 97.8,
      status: "HIGH VERACITY VERIFIED",
      metrics: [
        {
          title: "Research Quality",
          score: 98.9,
          color: "text-emerald-700",
          gradientFrom: "#10b981",
          gradientTo: "#059669",
          icon: Award,
          explanation: "Direct empirical telemetry from Google Sycamore & IBM Eagle.",
        },
        {
          title: "Source Agreement",
          score: 96.4,
          color: "text-indigo-700",
          gradientFrom: "#6366f1",
          gradientTo: "#4f46e5",
          icon: Globe,
          explanation: "Strong peer alignment across IEEE and Nature Physics.",
        },
        {
          title: "Citation Completeness",
          score: 99.5,
          color: "text-purple-700",
          gradientFrom: "#9333ea",
          gradientTo: "#7e22ce",
          icon: FileText,
          explanation: "Every error rate claim linked to hardware benchmarks.",
        },
        {
          title: "Hallucination Risk",
          score: 98.5,
          color: "text-emerald-800",
          gradientFrom: "#059669",
          gradientTo: "#047857",
          icon: ShieldCheck,
          explanation: "Zero unverified extrapolations detected.",
        },
      ],
    },
  ];

  const [selectedReport, setSelectedReport] = useState(reportsData[0]);

  // Recharts Radial Bar Dataset format
  const chartData = [
    {
      name: "Overall Veracity",
      value: selectedReport.overallScore,
      fill: "url(#veracityGradient)",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 text-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2 shadow-xs">
            <BarChart3 className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>VeriSphere Precision Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Animated Research Confidence Center
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Real-time quantitative audit metrics calculating research quality, source agreement, citation coverage, and hallucination safety.
          </p>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-2">
          {reportsData.map((rep) => (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedReport.id === rep.id
                  ? "bg-[#4F46E5] text-white font-bold shadow-md shadow-indigo-500/20"
                  : "bg-white text-gray-700 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {rep.topic.split(" ")[0]} Dataset
            </button>
          ))}
        </div>
      </div>

      {/* Main Radial Gauge Hero Card */}
      <div className="glass-card rounded-3xl p-8 border border-gray-200 bg-white relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-cyan-50/30 pointer-events-none" />

        {/* Left Info Column */}
        <div className="md:col-span-6 space-y-5 relative z-10">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            {selectedReport.status}
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
            {selectedReport.topic}
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Calculated via VeriSphere Multi-Agent Swarm logic. Incorporates source domain trust ranks, DOI validation status, and logical consistency tests.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Total Literature</span>
              <span className="text-gray-900 font-bold text-base">18 Papers</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Claims Scrubbed</span>
              <span className="text-[#06B6D4] font-bold text-base">6 Atomic Claims</span>
            </div>
          </div>
        </div>

        {/* Right Radial Gauge Chart Column */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative z-10 py-4">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Recharts Radial Bar Chart */}
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="100%"
                barSize={18}
                data={chartData}
                startAngle={225}
                endAngle={-45}
              >
                <defs>
                  <linearGradient id="veracityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#22C55E" />
                  </linearGradient>
                </defs>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: "#f1f5f9" }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>

            {/* Inner Ring Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Overall Veracity
              </span>
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {selectedReport.overallScore}%
              </span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Animated Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {selectedReport.metrics.map((metric, idx) => {
          const IconComp = metric.icon;

          return (
            <div
              key={idx}
              className="glass-card glass-card-hover rounded-2xl p-6 border border-gray-200 bg-white shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-gray-100 border border-gray-200 ${metric.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className={`text-2xl font-black font-mono ${metric.color}`}>
                    {metric.score}%
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base">{metric.title}</h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {metric.explanation}
                </p>
              </div>

              {/* Progress Bar Indicator */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>Metric Rating</span>
                  <span className="text-gray-900 font-bold">{metric.score}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden p-0.5 border border-gray-200">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${metric.score}%`,
                      background: `linear-gradient(90deg, ${metric.gradientFrom}, ${metric.gradientTo})`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
