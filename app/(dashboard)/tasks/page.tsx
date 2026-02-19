import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import CreateTaskForm from "./create-form";

export default async function TaskProtocolPage() {
  const allTasks = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      deadline: tasks.deadline,
      isPriority: tasks.isPriority,
      assigneeName: users.name,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assignedTo, users.id))
    .orderBy(desc(tasks.id));

  const staffMembers = await db.select({ id: users.id, name: users.name }).from(users);

  return (
    <div className="min-h-screen p-6 md:p-12 space-y-10">
      <header className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
          Task <span className="text-neon-yellow">Protocol</span>
        </h1>
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mt-3">
          AMP LEGAL // DOCKET INTELLIGENCE SYSTEM
        </p>
      </header>

      <CreateTaskForm staff={staffMembers} />

      {/* The interactive Kanban Board */}
      <KanbanBoard initialTasks={allTasks} />
    </div>
  );
}