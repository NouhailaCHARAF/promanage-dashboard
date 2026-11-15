import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import StatsCards from "../components/StatsCards";
import RecentProjects, {
  type RecentProjectItem,
} from "../components/RecentProjects";
import RecentTasks, { type RecentTaskItem } from "../components/RecentTasks";
import TeamMembers, { type TeamMemberItem } from "../components/TeamMembers";

export default function Dashboard() {
  const [projects, setProjects] = useState<RecentProjectItem[]>([]);
  const [tasks, setTasks] = useState<RecentTaskItem[]>([]);
  const [members, setMembers] = useState<TeamMemberItem[]>([]);

  useEffect(() => {
    async function fetchOverviewData() {
      const [projectsRes, tasksRes, teamRes] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase.from("tasks").select("*").order("id", { ascending: false }),
        supabase
          .from("team_members")
          .select("*")
          .order("id", { ascending: false }),
      ]);

      setProjects(projectsRes.data || []);
      setTasks(tasksRes.data || []);
      setMembers(teamRes.data || []);
    }

    fetchOverviewData();
  }, []);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === "In Progress",
  ).length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const teamCount = members.length;

  return (
    <div className="space-y-6">
      <StatsCards
        totalProjects={totalProjects}
        activeProjects={activeProjects}
        completedTasks={completedTasks}
        teamCount={teamCount}
      />
      <RecentProjects projects={projects.slice(0, 3)} />
      <RecentTasks tasks={tasks.slice(0, 3)} />
      <TeamMembers members={members.slice(0, 3)} />
    </div>
  );
}
