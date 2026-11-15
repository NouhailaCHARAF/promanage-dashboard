import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../supabaseClient";

type ProjectStatus = "In Progress" | "Completed" | "Pending";

interface Project {
  id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  deadline: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<"All" | ProjectStatus>(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Pending");
  const [progress, setProgress] = useState(0);
  const [deadline, setDeadline] = useState("");

  const filterOptions: ("All" | ProjectStatus)[] = [
    "All",
    "In Progress",
    "Completed",
    "Pending",
  ];

  const statusStyles: Record<ProjectStatus, string> = {
    "In Progress": "bg-blue-50 text-blue-600",
    Completed: "bg-emerald-50 text-emerald-600",
    Pending: "bg-amber-50 text-amber-600",
  };

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    }

    fetchProjects();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setProgress(0);
    setDeadline("");
    setShowForm(false);
  }

  function handleOpenNewForm() {
    if (showForm && editingId === null) {
      resetForm();
      return;
    }
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setProgress(0);
    setDeadline("");
    setShowForm(true);
  }

  function handleEditClick(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setStatus(project.status);
    setProgress(project.progress);
    setDeadline(project.deadline === "TBD" ? "" : project.deadline);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const projectData = {
      title: title.trim(),
      description: description.trim() || "No description provided",
      status,
      progress: status === "Completed" ? 100 : Number(progress),
      deadline: deadline || "TBD",
    };

    if (editingId !== null) {
      // Update existing project
      const { data, error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setProjects(projects.map((p) => (p.id === editingId ? data : p)));
    } else {
      // Insert new project
      const { data, error } = await supabase
        .from("projects")
        .insert([projectData])
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setProjects([data, ...projects]);
    }

    resetForm();
  }

  async function handleDeleteProject(id: number) {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setProjects(projects.filter((project) => project.id !== id));
  }

  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      selectedStatus === "All" || project.status === selectedStatus;
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading projects...
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
            <h2 className="text-xl font-bold text-slate-900">All Projects</h2>
            <p className="text-sm text-slate-500">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenNewForm}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {showForm && editingId === null ? "Cancel" : "+ New Project"}
          </button>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
          />

          <div className="flex flex-wrap gap-2">
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
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-blue-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              {editingId !== null ? "Edit Project" : "Create New Project"}
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
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. E-commerce Store"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short project summary"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Progress (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
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
              {editingId !== null ? "Save Changes" : "Add Project"}
            </button>
          </div>
        </form>
      )}

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No projects found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {project.description}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[project.status]}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                  <span>Progress</span>
                  <span className="font-medium text-slate-700">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      project.status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>Deadline: {project.deadline}</span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditClick(project)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project.id)}
                    className="font-medium text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
