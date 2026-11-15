export interface RecentTaskItem {
  id: number;
  title: string;
  assigned_to: string;
  priority: "High" | "Medium" | "Low";
  status: "In Progress" | "Pending" | "Completed";
  due_date: string;
}

interface RecentTasksProps {
  tasks: RecentTaskItem[];
}

export default function RecentTasks({ tasks }: RecentTasksProps) {
  const priorityStyles: Record<RecentTaskItem["priority"], string> = {
    High: "bg-rose-50 text-rose-600",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-slate-100 text-slate-600",
  };

  const statusStyles: Record<RecentTaskItem["status"], string> = {
    "In Progress": "bg-blue-50 text-blue-600",
    Pending: "bg-slate-100 text-slate-600",
    Completed: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Recent Tasks</h3>

      {tasks.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-500">No tasks yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="py-3 pr-4">Task</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 pl-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="py-3.5 pr-4 font-medium text-slate-900">
                    {task.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {task.assigned_to}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[task.status]}`}
                    >
                      ● {task.status}
                    </span>
                  </td>
                  <td className="py-3.5 pl-4 text-slate-500">
                    {task.due_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
