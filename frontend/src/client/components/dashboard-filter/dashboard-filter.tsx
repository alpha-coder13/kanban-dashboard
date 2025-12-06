import { X, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TaskInterface } from '../dashboard-tasks/interface';
import { API_BASE_URL, ENDPOINTS } from '@/URI';

interface FilterModalProps {
  task: any;
  onClose: (any) => void;
  getTasks: () => Promise<void>;
}

export function TaskFilter({ onClose }: FilterModalProps) {
  const [filters, setFilters] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assignee: '',
    status: 'TO DO',
  })
  const [filteredTasks, setTasks] = useState<TaskInterface[]>([]);
  const getTasks = async () => {
    fetch(API_BASE_URL + ENDPOINTS.GET.getTasks((new URLSearchParams(filters)).toString()), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setTasks(data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }

  useEffect(() => {
    getTasks();
  }, [filters]);
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };
  const handleReset = () => {
    setFilters({
      title: '',
      description: '',
      priority: '',
      dueDate: '',
      assignee: '',
      status: '',
    });
  };


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

        <div className="px-6 pt-6 pb-6 border-b border-gray-800/50">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Title</label>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                placeholder="Search title..."
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-sm text-white placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Description</label>
              <input
                type="text"
                value={filters.description}
                onChange={(e) => handleFilterChange('description', e.target.value)}
                placeholder="Search description..."
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-sm text-white placeholder-gray-600"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-sm text-white"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white"
              >
                <option value="TO DO">To do</option>
                <option value="IN PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Assignee</label>
              <input
                type="text"
                value={filters.assignee}
                onChange={(e) => handleFilterChange('assignee', e.target.value)}
                placeholder="Assignee initials..."
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-sm text-white placeholder-gray-600"
              />
            </div>

            {/* <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Tags</label>
              <input
                type="text"
                value={filters.tags}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-sm text-white placeholder-gray-600"
              />
            </div> */}

            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Due Date</label>
              <input
                type="text"
                value={filters.dueDate}
                onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                placeholder="Date format..."
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-sm text-white placeholder-gray-600"
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-800/50 transition-colors text-sm font-medium"
          >
            Reset Filters
          </button>
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
                key={(task.id).toString()}
                className="p-4 px-6 hover:bg-gray-900/30 transition-colors cursor-pointer border-l-2 border-transparent hover:border-l-gray-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-100 text-sm leading-tight flex-1">
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${task.priority === 'high'
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
