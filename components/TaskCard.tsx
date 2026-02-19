// components/TaskCard.tsx
export default function TaskCard({ task }: { task: any }) {
  return (
    <div className="bg-[#11111a] border-l-4 border-l-neon-yellow p-4 rounded-r-lg mb-4 hover:bg-[#1a1a25] transition-all cursor-grab active:scale-95">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] bg-electric-blue px-2 py-0.5 rounded text-white font-bold uppercase">
          {task.status}
        </span>
        <p className="text-gray-500 text-xs">#{task.id}</p>
      </div>
      <h4 className="text-white font-semibold text-sm mb-1">{task.title}</h4>
      <p className="text-gray-400 text-xs line-clamp-2">{task.description}</p>
      
      <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
        <div className="w-6 h-6 rounded-full bg-neon-yellow text-black flex items-center justify-center text-[10px] font-bold">
          JD
        </div>
        <span className="text-[10px] text-neon-yellow font-mono">
          DUE: {task.deadline?.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}