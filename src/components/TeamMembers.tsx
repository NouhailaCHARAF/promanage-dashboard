import { Link } from "react-router-dom";

export interface TeamMemberItem {
  id: number;
  name: string;
  role: string;
  email: string;
  status: "Active" | "Offline";
}

interface TeamMembersProps {
  members: TeamMemberItem[];
}

export default function TeamMembers({ members }: TeamMembersProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Team Members</h3>
        <Link
          to="/team"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          View All Members →
        </Link>
      </div>

      {members.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-500">
          No team members yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-xl border border-slate-100 bg-slate-50/40 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {member.name}
                  </h4>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-slate-100/70 px-3 py-2 text-xs text-slate-600 truncate">
                {member.email}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400">Status</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-medium ${
                    member.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  ● {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
