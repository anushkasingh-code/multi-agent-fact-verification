import { NavigationTab } from "../types";
import { Globe, Terminal, GitFork, ShieldCheck } from "lucide-react";

interface FooterProps {
  onTabChange: (tab: NavigationTab) => void;
}

export function Footer({ onTabChange }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 relative z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Summary */}
        <div className="space-y-4">
          <div
            onClick={() => onTabChange("dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <ShieldCheck className="w-6 h-6 text-[#4F46E5]" />
            <span className="text-xl font-bold text-gray-900 group-hover:text-[#4F46E5] transition-colors">
              VeriSphere AI
            </span>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed">
            Advancing human knowledge through autonomous multi-agent verification and zero-hallucination research.
          </p>
          <div className="flex gap-3 text-gray-500">
            <a href="#" className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-[#4F46E5] transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-[#4F46E5] transition-colors">
              <Terminal className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-[#4F46E5] transition-colors">
              <GitFork className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 1: Product */}
        <div className="space-y-3">
          <h5 className="text-gray-900 font-bold text-sm">Product</h5>
          <ul className="space-y-2 text-xs text-gray-600">
            <li>
              <button onClick={() => onTabChange("dashboard")} className="hover:text-[#4F46E5] transition-colors">
                Features & Bento Grid
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange("agents")} className="hover:text-[#4F46E5] transition-colors">
                Autonomous Swarm SDK
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange("research")} className="hover:text-[#4F46E5] transition-colors">
                Fact Verification Engine
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange("vault")} className="hover:text-[#4F46E5] transition-colors">
                Truth Ledger Vault
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Resources */}
        <div className="space-y-3">
          <h5 className="text-gray-900 font-bold text-sm">Resources</h5>
          <ul className="space-y-2 text-xs text-gray-600">
            <li><a href="#" className="hover:text-[#4F46E5] transition-colors">API Documentation</a></li>
            <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Research Papers</a></li>
            <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Multi-Agent Swarm Spec</a></li>
            <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Case Studies</a></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="space-y-3">
          <h5 className="text-gray-900 font-bold text-sm">Company</h5>
          <ul className="space-y-2 text-xs text-gray-600">
            <li><a href="#" className="hover:text-[#4F46E5] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 mt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <span>© 2026 VeriSphere AI Technologies. All rights reserved.</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-emerald-600 font-bold">Uptime 99.99%</span>
        </div>
      </div>
    </footer>
  );
}
