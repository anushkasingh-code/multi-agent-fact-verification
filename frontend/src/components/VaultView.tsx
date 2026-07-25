import { useState } from "react";
import { VaultItem } from "../types";
import {
  Database,
  Search,
  FileText,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Bookmark,
  Share2,
  Calendar,
  Layers,
} from "lucide-react";

import { useAnalysisContext } from "../context/AnalysisContext";

interface VaultViewProps {
  items: VaultItem[];
  onDeleteItem: (id: string) => void;
}

export function VaultView({ items, onDeleteItem }: VaultViewProps) {
  const { vaultItems: contextVaultItems, deleteVaultItem: contextDeleteVaultItem } = useAnalysisContext();
  const allItems = [...contextVaultItems, ...items.filter((i) => !contextVaultItems.some((c) => c.id === i.id))];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [activeItem, setActiveItem] = useState<VaultItem | null>(null);

  const handleDelete = (id: string) => {
    contextDeleteVaultItem(id);
    onDeleteItem(id);
  };

  const domains = [
    "All",
    "Quantum Computing",
    "Biotechnology",
    "Semiconductor",
    "Macroeconomics",
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain =
      selectedDomain === "All" || item.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 text-gray-900">
      {/* Vault Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Database className="w-8 h-8 text-[#06B6D4]" />
            <span>VeriSphere Truth Ledger & Vault</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Archived research reports, verified citations, and immutable fact records.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vault reports..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:border-[#06B6D4] shadow-xs"
          />
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedDomain === dom
                ? "bg-[#06B6D4] text-white border border-cyan-300 shadow-xs font-bold"
                : "bg-white text-gray-700 border border-gray-200 hover:text-gray-900"
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Grid of Stored Reports */}
      {filteredItems.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-4 border border-gray-200 bg-white shadow-sm">
          <Database className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Vault Records Found</h3>
          <p className="text-xs text-gray-500">
            Run a research query in the Research tab and click "Save to Vault" to archive findings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-gray-200 bg-white shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold">
                    {item.domain}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{item.veracityScore}% Veracity</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-snug hover:text-indigo-700 transition-colors cursor-pointer" onClick={() => setActiveItem(item)}>
                  {item.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {item.findingsPreview}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-indigo-700 font-medium">
                    <FileText className="w-3.5 h-3.5" />
                    {item.citationsCount} Citations
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveItem(item)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg border border-gray-200 transition-colors"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Item Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full rounded-2xl p-6 border border-gray-200 bg-white space-y-5 max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
                  {activeItem.domain}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{activeItem.title}</h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-gray-400 hover:text-gray-900 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {activeItem.findingsPreview}
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-xs">
              <span className="text-[#06B6D4] font-bold">Veracity: {activeItem.veracityScore}%</span>
              <button
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 bg-[#4F46E5] text-white font-semibold rounded-xl hover:bg-indigo-700"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
