import { NavigationTab, NotificationItem } from "../types";
import { Bell, Settings, ShieldCheck, User } from "lucide-react";

interface NavbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  notifications: NotificationItem[];
  onToggleNotifications: () => void;
  showNotifications: boolean;
  onOpenSettings: () => void;
}

export function Navbar({
  activeTab,
  onTabChange,
  notifications,
  onToggleNotifications,
  onOpenSettings,
}: NavbarProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const userAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aCbN2eqkgwT6AtFIRaMDQoYRyM0xL4mUxZ_r5q9BFVAPqsar5p9gdZ2Woyhxfi6f8oRZaqbc5vPNHto6rP9SnWmnGtMYRW4CpjppuPCKN6YOIAv7CtnhjSMoWsHZ7Z7aH3-wjGYb1kQmrmLNPaTkXwh3Ra42eVL3s5V2aWcewuwfapCXKuveK1QaAULYjhrJEogaN4yH0pK4Raw1Y3DD9420e5CysiRNXKyqF_iea-M4zD9er4eF2NhlQ0L0aLKjWhFMa_bRWDhr";

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-3.5 flex justify-between items-center transition-all shadow-xs">
      {/* Brand Logo */}
      <div
        onClick={() => onTabChange("dashboard")}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-[#4F46E5]/20 group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-[#4F46E5] transition-colors">
            VeriSphere AI
          </span>
          <span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold">
            Multi-Agent Fact Lab
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="hidden lg:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200 overflow-x-auto">
        {(
          [
            { id: "dashboard", label: "Dashboard" },
            { id: "collaboration", label: "Agent Swarm" },
            { id: "graph", label: "Knowledge Graph" },
            { id: "timeline", label: "Claims Timeline" },
            { id: "confidence", label: "Confidence Center" },
            { id: "agents", label: "Roster" },
            { id: "research", label: "Research" },
            { id: "vault", label: "Vault" },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#4F46E5] text-white shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#4F46E5] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="relative w-9 h-9 rounded-full border border-gray-300 overflow-hidden bg-gray-100 shadow-xs">
            <img
              src={userAvatar}
              alt="User Headshot"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback icon if image fails to load
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <User className="w-5 h-5 text-gray-400 absolute inset-0 m-auto -z-10" />
          </div>
        </div>
      </div>
    </nav>
  );
}
