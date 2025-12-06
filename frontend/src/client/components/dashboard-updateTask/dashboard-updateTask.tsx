import { API_BASE_URL, ENDPOINTS } from '@/URI';
import { X, Type } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Task {
    id: number,
    title: string;
    description: string;
    priority: string;
    status: string;
    tags: any;
    dueDate: string;
    assignee?: string;
}

interface TaskUpdateModalProps {
    task: Task | null;
    onClose: (any) => void;
    onUpdateTask: (task: Task) => void;
    getTasks: () => void;
}

export function TaskUpdate({ task, onClose, onUpdateTask, getTasks }: any) {
    const [formData, setFormData] = useState<any>({
        title: '',
        description: '',
        priority: 'low',
        status: 'To do',
        tags: '',
        dueDate: '',
        assignee: '',
    });
    useEffect(() => {
        if (task) {
            setFormData({
                title: task?.title || '',
                description: task?.description || '',
                priority: task?.priority.toLowerCase() || 'low',
                status: task?.status.toLowerCase() || 'To do',
                tags: task?.tags?.join(',') || '',
                dueDate: task?.dueDate || '',
                assignee: task?.assignee || '',
            });
        }
    }, [task]);


    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));

    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;
        let tags = formData.tags.split(',').map((t: any) => t.trim());
        let status = formData.status.toUpperCase();
        let priority = formData.priority.toUpperCase();
        fetch(`${API_BASE_URL}${ENDPOINTS.PUT.putTask(task?.id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData, tags, status, priority }),
        }).then((data) => data.json()).then((data) => {
            console.log(data);
            if (data.status !== 'failure') {
                getTasks();
            }
        }).catch((err) => {
            console.log(err);
        })
        onClose(undefined);
    };

    return (
        <>
            <div className="bg-gradient-to-b from-gray-950 to-black border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-black/50">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <Type className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-medium text-white">Update Task</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        <X className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
                    <div className="space-y-4 pt-6">
                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-2 block">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                placeholder="Enter task title..."
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white placeholder-gray-600"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-2 block">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                placeholder="Add task details..."
                                rows={4}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white placeholder-gray-600 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-400 mb-2 block">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white"
                                >
                                    <option value="">Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="critical">Critical</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-400 mb-2 block">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white"
                                >
                                    <option value="TO DO">To do</option>
                                    <option value="IN PROGRESS">In progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-400 mb-2 block">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white placeholder-gray-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-2 block">Assignee</label>
                            <input
                                type="text"
                                name="assignee"
                                value={formData.assignee || ''}
                                onChange={handleFormChange}
                                placeholder="Initials (e.g., JD)"
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white placeholder-gray-600"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-2 block">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleFormChange}
                                placeholder="Design, UI, Frontend"
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white placeholder-gray-600"
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-8 mt-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 bg-gray-900/50 border border-gray-700 text-gray-300 rounded-full hover:bg-gray-800 transition-all duration-300 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 text-black rounded-full hover:from-gray-400 hover:via-gray-300 hover:to-gray-400 transition-all duration-300 font-medium shadow-lg shadow-gray-500/30 hover:shadow-gray-400/40"
                            onClick={handleFormSubmit}
                        >
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
