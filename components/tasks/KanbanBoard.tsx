"use client"

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { toggleTaskStatus, updateTaskDetails } from "@/lib/actions/tasks/action";
import { 
  CheckCircle2, Circle, Clock, Gavel, Send, 
  ChevronRight, GripVertical 
} from "lucide-react";

const COLUMNS = [
  { id: "PENDING", label: "Initial Protocol", color: "text-gray-500" },
  { id: "IN_PROGRESS", label: "Active Litigation", color: "text-electric-blue" },
  { id: "COMPLETED", label: "Closed Docket", color: "text-neon-yellow" }
];

export default function KanbanBoard({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // 1. Optimistic UI Update
    const movedTaskId = parseInt(draggableId);
    const newStatus = destination.droppableId as any;
    
    setTasks(prev => prev.map(t => t.id === movedTaskId ? { ...t, status: newStatus } : t));

    // 2. Persist to DB using your existing action
    await toggleTaskStatus(movedTaskId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className={`text-[11px] font-black uppercase tracking-[0.3em] ${col.color}`}>
                {col.label}
              </h2>
              <span className="text-[10px] font-mono text-gray-800">
                {tasks.filter(t => t.status === col.id).length.toString().padStart(2, '0')}
              </span>
            </div>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-4 min-h-[500px] transition-colors rounded-sm p-2 ${
                    snapshot.isDraggingOver ? "bg-white/[0.02] ring-1 ring-white/5" : ""
                  }`}
                >
                  {tasks.filter(t => t.status === col.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-[#07070B] border transition-all ${
                            snapshot.isDragging 
                              ? "border-neon-yellow shadow-[0_0_20px_rgba(204,255,0,0.15)] scale-[1.02]" 
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          {/* Drag Handle & Header */}
                          <div className="p-4 flex items-start gap-3">
                            <div {...provided.dragHandleProps} className="mt-1 text-gray-800 hover:text-gray-400 cursor-grab active:cursor-grabbing">
                              <GripVertical size={18} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className={`text-xs font-bold uppercase tracking-tight ${task.status === "COMPLETED" ? "text-gray-600 line-through" : "text-white"}`}>
                                  {task.title}
                                </h3>
                                {task.isPriority && <span className="w-1.5 h-1.5 rounded-full bg-vibrant-pink animate-pulse" />}
                              </div>
                              <p className="text-[9px] font-mono text-gray-700 mt-1 uppercase italic">
                                {task.assigneeName || "Unassigned"}
                              </p>
                            </div>
                          </div>

                          {/* Simplified Historical Log (Visible on Card) */}
                          <div className="px-4 pb-4 border-t border-white/5 bg-black/20">
                            <div className="mt-3 flex items-center justify-between text-[8px] font-black text-gray-600 uppercase italic">
                              <span className="flex items-center gap-1"><Clock size={10}/> Next: {task.deadline ? new Date(task.deadline).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'}) : "TBD"}</span>
                              <span className="text-white/20">REF_{task.id}</span>
                            </div>
                            
                            {/* Fast Update Input */}
                            <form action={updateTaskDetails} className="mt-3 flex gap-2">
                              <input type="hidden" name="taskId" value={task.id} />
                              <input 
                                name="newDirection"
                                placeholder="QUICK LOG..."
                                className="flex-1 bg-white/5 border border-white/5 px-2 py-1.5 text-[9px] text-white outline-none focus:border-neon-yellow/30 transition-all"
                              />
                              <button type="submit" className="p-1.5 bg-white text-black hover:bg-neon-yellow transition-colors">
                                <Send size={10} />
                              </button>
                            </form>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}