import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  X,
} from "lucide-react";
import type { UserProfile } from "../App";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  user: UserProfile;
}

const navItems = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Tasks", path: "/tasks", icon: CheckSquare },
  { name: "Team", path: "/team", icon: Users },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({
  isMobileMenuOpen,
  onCloseMobileMenu,
  user,
}: SidebarProps) {
  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <aside className="hidden md:flex w-64 bg-slate-900 text-white p-6 shrink-0 flex-col justify-between border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
              P
            </div>
            <h1 className="text-xl font-bold tracking-wide text-slate-100">
              ProManage
            </h1>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-slate-800 text-white font-medium"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-700 shrink-0">
            {initials || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">
              {user.fullName}
            </p>
            <p className="text-xs text-slate-400 truncate">{user.role}</p>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onCloseMobileMenu}
          />

          <aside className="relative w-64 bg-slate-900 text-white p-6 flex flex-col justify-between border-r border-slate-800 z-10 shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-10 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
                    P
                  </div>
                  <h1 className="text-xl font-bold text-slate-100">
                    ProManage
                  </h1>
                </div>

                <button
                  onClick={onCloseMobileMenu}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      onClick={onCloseMobileMenu} // باش تسد المينيو في الموبايل فاش تكليكي على شي صفحة
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-slate-800 text-white font-medium"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`
                      }
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-700 shrink-0">
                {initials || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.role}</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
