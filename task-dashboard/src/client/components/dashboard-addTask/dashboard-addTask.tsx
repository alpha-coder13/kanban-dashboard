import { X, Pen, Mic } from 'lucide-react';
import { useState } from 'react';
import { AddTaskModalProps } from './interface';


export function AddTaskModal({ }: AddTaskModalProps) {
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTextInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-950 to-black border border-gray-800 rounded-2xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-black/50">
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 pb-6">
          <div className="flex-1 relative flex items-center justify-center">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Create your task..."
              className="w-full h-full bg-transparent text-center text-lg font-light placeholder-gray-600 focus:outline-none resize-none text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-200 to-gray-400"
              style={{
                textShadow: '0 0 0 #e5e7eb',
                letterSpacing: '1px',
                lineHeight: '1.8',
              }}
            />
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Create your task..."
              className="absolute inset-0 w-full h-full bg-transparent focus:outline-none resize-none text-center text-lg font-light text-transparent placeholder-gray-600"
              style={{
                letterSpacing: '1px',
                lineHeight: '1.8',
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400 transition-all duration-300 flex items-center justify-center text-black shadow-lg hover:shadow-gray-500/30"
            >
              <Pen className="w-5 h-5" />
            </button>

            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

            <button
              type="button"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400 transition-all duration-300 flex items-center justify-center text-black shadow-lg hover:shadow-gray-500/30"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 pt-8">
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
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
