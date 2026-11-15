import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, User, Settings, LogOut } from "lucide-react";

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

interface NotificationItem {
  id: number;
  title: string;
  time: string;
  isRead: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Sarah completed 'Design Homepage'",
    time: "5 min ago",
    isRead: false,
  },
  {
    id: 2,
    title: "New project 'API Integration' was added",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: 3,
    title: "John commented on 'Fix Login Bug'",
    time: "3 hours ago",
    isRead: true,
  },
  {
    id: 4,
    title: "Deadline approaching for Website Redesign",
    time: "Yesterday",
    isRead: true,
  },
];

export default function Header({ onOpenMobileMenu, onLogout }: HeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAllNotifs, setShowAllNotifs] = useState(false);

  const hasUnread = initialNotifications.some((item) => !item.isRead);
  const visibleNotifications = showAllNotifs
    ? initialNotifications
    : initialNotifications.slice(0, 3);

  function toggleNotifications() {
    setIsNotifOpen(!isNotifOpen);
    setIsUserMenuOpen(false);
  }

  function toggleUserMenu() {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotifOpen(false);
  }

  return (
    <header className="bg-white px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          ☰
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
          Overview
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={toggleNotifications}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all relative shrink-0"
          >
            <Bell size={18} />
            {hasUnread && (
              <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 rounded-full bg-slate-800" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200 bg-white shadow-lg z-50">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">
                  Notifications
                </span>
                <span className="text-xs text-slate-400">
                  {initialNotifications.length} total
                </span>
              </div>

              <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
                {visibleNotifications.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-3 text-sm ${
                      item.isRead ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <p className="font-medium text-slate-800">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
                  </div>
                ))}
              </div>

              {!showAllNotifs && (
                <div className="border-t border-slate-100 p-2">
                  <button
                    type="button"
                    onClick={() => setShowAllNotifs(true)}
                    className="w-full rounded-lg py-2 text-center text-xs font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    See all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={toggleUserMenu}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all shrink-0"
          >
            <User size={18} />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg z-50">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-sm font-semibold text-slate-800">
                  Nouhaila Charaf
                </p>
                <p className="text-xs text-slate-500">nouhaila@promanage.com</p>
              </div>

              <div className="py-1.5">
                <Link
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Settings size={16} className="text-slate-500" />
                  <span>Account Settings</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
