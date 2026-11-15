import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../supabaseClient";

type TaskPriority = "High" | "Medium" | "Low";
type TaskStatus = "In Progress" | "Pending" | "Completed";

interface Task {
  id: number;
  title: string;
  assigned_to: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<"All" | TaskStatus>(
    "All",
  );

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [dueDate, setDueDate] = useState("");

  const filterOptions: ("All" | TaskStatus)[] = [
    "All",
    "In Progress",
    "Pending",
    "Completed",
  ];

  const priorityStyles: Record<TaskPriority, string> = {
    High: "bg-rose-50 text-rose-600",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-slate-100 text-slate-600",
  };

  const statusStyles: Record<TaskStatus, string> = {
    "In Progress": "bg-blue-50 text-blue-600",
    Pending: "bg-slate-100 text-slate-600",
    Completed: "bg-emerald-50 text-emerald-600",
  };

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setTasks(data || []);
      }

      setLoading(false);
    }

    fetchTasks();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setAssignedTo("");
    setPriority("Medium");
    setStatus("Pending");
    setDueDate("");
    setShowForm(false);
  }

  function handleOpenNewForm() {
    if (showForm && editingId === null) {
      resetForm();
      return;
    }
    setEditingId(null);
    setTitle("");
    setAssignedTo("");
    setPriority("Medium");
    setStatus("Pending");
    setDueDate("");
    setShowForm(true);
  }

  function handleEditClick(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setAssignedTo(task.assigned_to === "Unassigned" ? "" : task.assigned_to);
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.due_date === "TBD" ? "" : task.due_date);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      assigned_to: assignedTo.trim() || "Unassigned",
      priority,
      status,
      due_date: dueDate || "TBD",
    };

    if (editingId !== null) {
      const { data, error } = await supabase
        .from("tasks")
        .update(taskData)
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setTasks(tasks.map((t) => (t.id === editingId ? data : t)));
    } else {
      const { data, error } = await supabase
        .from("tasks")
        .insert([taskData])
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setTasks([data, ...tasks]);
    }

    resetForm();
  }

  async function handleStatusChange(id: number, newStatus: TaskStatus) {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task,
      ),
    );
  }

  async function handleDeleteTask(id: number) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setTasks(tasks.filter((task) => task.id !== id));
  }

  const filteredTasks =
    selectedStatus === "All"
      ? tasks
      : tasks.filter((task) => task.status === selectedStatus);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          Error: {error}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">All Tasks</h2>
            <p className="text-sm text-slate-500">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenNewForm}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {showForm && editingId === null ? "Cancel" : "+ New Task"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedStatus(option)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedStatus === option
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-blue-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              {editingId !== null ? "Edit Task" : "Create New Task"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Task Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build API endpoint"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Assigned To
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {editingId !== null ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {task.assigned_to}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(
                            task.id,
                            e.target.value as TaskStatus,
                          )
                        }
                        className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium outline-none ${statusStyles[task.status]}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {task.due_date}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        type="button"
                        onClick={() => handleEditClick(task)}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-xs font-medium text-rose-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
