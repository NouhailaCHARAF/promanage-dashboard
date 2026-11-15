import { Folder, Briefcase, CheckCircle2, Users } from "lucide-react";

interface StatsCardsProps {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  teamCount: number;
}

export default function StatsCards({
  totalProjects,
  activeProjects,
  completedTasks,
  teamCount,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: Folder,
      iconColor: "text-blue-600",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      icon: Briefcase,
      iconColor: "text-purple-600",
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
    },
    {
      label: "Team Members",
      value: teamCount,
      icon: Users,
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <Icon className={`mb-3 h-5 w-5 ${item.iconColor}`} />
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {String(item.value).padStart(2, "0")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
