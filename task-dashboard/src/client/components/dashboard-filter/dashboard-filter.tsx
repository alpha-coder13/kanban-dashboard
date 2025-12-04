import { X, Search } from 'lucide-react';
import { useState } from 'react';
import { TaskInterface } from '../dashboard-tasks/interface';

interface FilterModalProps {
  onClose: () => void;
}

export function TaskFilter({onClose}: FilterModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const filteredTasks = [];
  return (
    <>
      <div className="bg-gradient-to-b from-gray-950 to-black border border-gray-800 rounded-2xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-black/50">
        <div className="flex justify-end p-6 border-b border-gray-800/50">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="px-6 pt-6 pb-4 border-b border-gray-800/50">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white placeholder-gray-600"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">Priority</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setSelectedPriority(selectedPriority === priority ? null : priority)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                    selectedPriority === priority
                      ? priority === 'high'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                        : priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                      : 'bg-gray-800/30 text-gray-400 border border-gray-700/50 hover:bg-gray-800/50'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <style>{`
            ::-webkit-scrollbar {
              width: 6px;
            }
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            ::-webkit-scrollbar-thumb {
              background: #3f3f46;
              border-radius: 3px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #52525b;
            }
          `}</style>
          <div className="divide-y divide-gray-800/30">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 px-6 hover:bg-gray-900/30 transition-colors cursor-pointer border-l-2 border-transparent hover:border-l-gray-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-100 text-sm leading-tight flex-1">
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    task.priority === 'high'
                      ? 'bg-red-500/15 text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-blue-500/15 text-blue-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-2">{task.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-800/40 text-gray-400 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 text-xs ml-2">{task.dueDate}</span>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">No tasks match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
