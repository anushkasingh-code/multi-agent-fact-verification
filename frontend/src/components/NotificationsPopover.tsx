import { NotificationItem } from "../types";
import { Bell, Check, Trash2, X, AlertCircle, ShieldCheck, Info } from "lucide-react";

interface NotificationsPopoverProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export function NotificationsPopover({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
  onClearNotifications,
}: NotificationsPopoverProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-6 z-50 w-80 md:w-96 glass-card rounded-2xl p-4 border border-gray-200 bg-white shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#4F46E5]" />
          <h3 className="text-sm font-bold text-gray-900">System Alerts</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="text-[11px] text-indigo-600 hover:underline font-medium"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 p-0.5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-xs text-center text-gray-500 py-6">No new notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border transition-colors ${
                n.read
                  ? "bg-gray-50 border-gray-200 opacity-70"
                  : "bg-white border-indigo-200 text-gray-900 font-medium shadow-2xs"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {n.type === "success" && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                {n.type === "warning" && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                {n.type === "info" && <Info className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />}

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-900 leading-tight">{n.title}</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{n.description}</p>
                  <span className="text-[10px] text-gray-400 block font-mono">{n.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="pt-2 border-t border-gray-200 text-center">
          <button
            onClick={onClearNotifications}
            className="text-[11px] text-gray-500 hover:text-rose-600 font-medium transition-colors"
          >
            Clear Notification History
          </button>
        </div>
      )}
    </div>
  );
}
