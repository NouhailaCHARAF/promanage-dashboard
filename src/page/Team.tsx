import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../supabaseClient";

type MemberStatus = "Active" | "Offline";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  status: MemberStatus;
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setMembers(data || []);
      }

      setLoading(false);
    }

    fetchMembers();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setRole("");
    setEmail("");
    setShowForm(false);
  }

  function handleOpenNewForm() {
    if (showForm && editingId === null) {
      resetForm();
      return;
    }
    setEditingId(null);
    setName("");
    setRole("");
    setEmail("");
    setShowForm(true);
  }

  function handleEditClick(member: TeamMember) {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setEmail(member.email);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const memberData = {
      name: name.trim(),
      role: role.trim() || "Team Member",
      email: email.trim(),
    };

    if (editingId !== null) {
      const { data, error } = await supabase
        .from("team_members")
        .update(memberData)
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setMembers(members.map((m) => (m.id === editingId ? data : m)));
    } else {
      const { data, error } = await supabase
        .from("team_members")
        .insert([{ ...memberData, status: "Active" as MemberStatus }])
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setMembers([data, ...members]);
    }

    resetForm();
  }

  async function toggleStatus(id: number, currentStatus: MemberStatus) {
    const nextStatus: MemberStatus =
      currentStatus === "Active" ? "Offline" : "Active";

    const { error } = await supabase
      .from("team_members")
      .update({ status: nextStatus })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    const updatedMembers: TeamMember[] = members.map((member) =>
      member.id === id ? { ...member, status: nextStatus } : member,
    );
    setMembers(updatedMembers);
  }

  async function handleDeleteMember(id: number) {
    const { error } = await supabase.from("team_members").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setMembers(members.filter((member) => member.id !== id));
  }

  const filteredMembers = members.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading team members...
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

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Team Members</h2>
          <p className="text-sm text-slate-500">
            {filteredMembers.length} of {members.length} members
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or role..."
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
          />

          <button
            type="button"
            onClick={handleOpenNewForm}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {showForm && editingId === null ? "Cancel" : "+ Add Member"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-blue-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              {editingId !== null ? "Edit Team Member" : "Add Team Member"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali Hassan"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Backend Developer"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali@example.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
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
              {editingId !== null ? "Save Changes" : "Save Member"}
            </button>
          </div>
        </form>
      )}

      {filteredMembers.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No team members found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {member.email}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => toggleStatus(member.id, member.status)}
                  title="Click to toggle status"
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    member.status === "Active"
                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  ● {member.status}
                </button>

                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleEditClick(member)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(member.id)}
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
