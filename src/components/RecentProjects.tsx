import { Link } from "react-router-dom";

export interface RecentProjectItem {
  id: number;
  title: string;
  description: string;
  status: "In Progress" | "Completed" | "Pending";
  progress: number;
  deadline: string;
}

interface RecentProjectsProps {
  projects: RecentProjectItem[];
}

export default function RecentProjects({ projects }: RecentProjectsProps) {
  const statusStyles: Record<RecentProjectItem["status"], string> = {
    "In Progress": "bg-blue-50 text-blue-600",
    Completed: "bg-emerald-50 text-emerald-600",
    Pending: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Recent Projects</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {projects.length} Projects
        </span>
      </div>

      {projects.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-500">
          No projects yet.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-slate-100 bg-slate-50/40 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {project.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {project.description}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[project.status]}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${
                      project.status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  {project.progress}%
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Deadline: {project.deadline}</span>
                <Link
                  to="/projects"
                  className="font-medium text-blue-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
