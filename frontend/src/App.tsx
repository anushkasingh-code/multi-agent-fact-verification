import { useState } from "react";
import { NavigationTab, NotificationItem, ResearchResult, VaultItem } from "./types";
import { Navbar } from "./components/Navbar";
import { DashboardView } from "./components/DashboardView";
import { AgentCollaborationView } from "./components/AgentCollaborationView";
import { InteractiveKnowledgeGraph } from "./components/InteractiveKnowledgeGraph";
import { ClaimVerificationTimeline } from "./components/ClaimVerificationTimeline";
import { ConfidenceCenterView } from "./components/ConfidenceCenterView";
import { AgentsView } from "./components/AgentsView";
import { ResearchView } from "./components/ResearchView";
import { VaultView } from "./components/VaultView";
import { DemoModal } from "./components/DemoModal";
import { SettingsModal } from "./components/SettingsModal";
import { NotificationsPopover } from "./components/NotificationsPopover";
import { Footer } from "./components/Footer";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("dashboard");
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      title: "VeriSphere Swarm Ready",
      description: "5 specialized agents initialized and connected to arXiv & IEEE Xplore.",
      timestamp: "Just now",
      read: false,
      type: "info",
    },
    {
      id: "n-2",
      title: "Hallucination Isolated",
      description: "Logic Critic caught 2 unbacked extrapolations during Quantum Error Correction research.",
      timestamp: "5m ago",
      read: false,
      type: "warning",
    },
    {
      id: "n-3",
      title: "Report Verified",
      description: "CRISPR Safety Audit finalized with 99.1% veracity rating and 14 DOI citations.",
      timestamp: "1h ago",
      read: true,
      type: "success",
    },
  ]);

  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    {
      id: "v-1",
      title: "Quantum Error Correction Code Breakthroughs (2026)",
      query: "Quantum Error Correction Code Breakthroughs 2026",
      domain: "Quantum Computing",
      veracityScore: 98.4,
      citationsCount: 18,
      date: "2026-07-24",
      status: "VERIFIED",
      findingsPreview:
        "Cross-verification across 18 peer-reviewed datasets confirms active surface code fault-tolerance thresholds below 10^-4 physical error rates. Isolated 2 speculative claims regarding instantaneous zero-overhead routing.",
    },
    {
      id: "v-2",
      title: "LK-99 Ambient Superconductor Re-evaluation & Replication",
      query: "Room Temperature Superconductors Material Analysis",
      domain: "Semiconductor",
      veracityScore: 96.2,
      citationsCount: 22,
      date: "2026-07-23",
      status: "VERIFIED",
      findingsPreview:
        "Multi-agent synthesis of 22 replication studies proves partial levitation originates from ferromagnetic Cu2S phase transitions rather than bulk superconductivity. All claims of zero-resistivity above 300K refuted.",
    },
    {
      id: "v-3",
      title: "CRISPR-Cas12a Off-Target Gene Editing Safety Audit",
      query: "CRISPR Off-Target Gene Editing Safety Audit",
      domain: "Biotechnology",
      veracityScore: 99.1,
      citationsCount: 14,
      date: "2026-07-22",
      status: "VERIFIED",
      findingsPreview:
        "Comprehensive genomic sequencing comparison shows 99.1% specificity with engineered Cas12a variants. Footnoted against primary PubMed and Nature Biotechnology trials.",
    },
  ]);

  const handleSaveToVault = (res: ResearchResult) => {
    const newItem: VaultItem = {
      id: `vault-${Date.now()}`,
      title: res.query,
      query: res.query,
      domain: res.category || "Advanced Technology",
      veracityScore: res.veracityScore,
      citationsCount: res.citations.length,
      date: new Date().toISOString().split("T")[0],
      status: "VERIFIED",
      findingsPreview: res.findings,
    };

    setVaultItems((prev) => [newItem, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Report Saved to Vault",
        description: `"${res.query}" was archived with ${res.veracityScore}% veracity.`,
        timestamp: "Just now",
        read: false,
        type: "success",
      },
      ...prev,
    ]);
  };

  const handleDeleteVaultItem = (id: string) => {
    setVaultItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans selection:bg-[#4F46E5] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        notifications={notifications}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        showNotifications={showNotifications}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Sub-navigation bar for small/mobile screens */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs shadow-sm">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "collaboration", label: "Swarm Feed" },
          { id: "graph", label: "Knowledge Graph" },
          { id: "timeline", label: "Claims Timeline" },
          { id: "confidence", label: "Confidence Center" },
          { id: "agents", label: "Agent Roster" },
          { id: "research", label: "Research Prompt" },
          { id: "vault", label: "Truth Vault" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as NavigationTab)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-[#4F46E5] text-white font-bold shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Popover */}
      <NotificationsPopover
        notifications={notifications}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onClearNotifications={handleClearNotifications}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === "dashboard" && (
          <DashboardView
            onTabChange={setActiveTab}
            onOpenDemo={() => setIsDemoOpen(true)}
          />
        )}

        {activeTab === "collaboration" && <AgentCollaborationView />}

        {activeTab === "graph" && <InteractiveKnowledgeGraph />}

        {activeTab === "timeline" && <ClaimVerificationTimeline />}

        {activeTab === "confidence" && <ConfidenceCenterView />}

        {activeTab === "agents" && <AgentsView />}

        {activeTab === "research" && (
          <ResearchView onSaveToVault={handleSaveToVault} />
        )}

        {activeTab === "vault" && (
          <VaultView
            items={vaultItems}
            onDeleteItem={handleDeleteVaultItem}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onTabChange={setActiveTab} />

      {/* Interactive Modals */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
