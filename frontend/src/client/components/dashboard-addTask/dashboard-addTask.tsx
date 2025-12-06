import { X, Pen, Mic, MicOff, Type } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { AddTaskFormInterface, AddTaskModalProps } from './interface';
import { useDashBoardContext } from '@/client/Store/container';
import { API_BASE_URL, ENDPOINTS } from '@/URI';

interface VoiceReactiveOrbProps {
  isListening?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const useSTT = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    } else {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const handleTranscriptEdit = useCallback((value: string) => {
    setTranscript(value);
  }, []);

  return { transcript, isListening, setIsListening, handleTranscriptEdit };
}

const AddTaskForm = ({ onClose, handleFormSubmit, formData, setFormData, tagInput, setTagInput }: any) => {

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setTagInput((prev: any) => (value));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handletagInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const { key } = e;
    console.log(key);
    if (key == 'Enter' || key == ' ') {
      if (tagInput.trim()) {
        setFormData((prev: any) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
        setTagInput('');
      }
    }
  };

  return (
    <form className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
      <div className="space-y-4">
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

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="critical">Critical</option>
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
              placeholder="Mar 15"
              className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white placeholder-gray-600"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">Tags</label>
            <input
              type="text"
              name="tags"
              value={tagInput}
              onChange={handleFormChange}
              onKeyDown={handletagInputChange}
              placeholder="Design, UI"
              className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-white placeholder-gray-600"
            />
            {formData.tags.length > 0 && (<div className="flex flex-wrap gap-2 mb-3 w-full px-4 py-2.5">
              {formData.tags.map((tag: any, idx: any) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-800/50 border border-gray-700/50 rounded text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>)
            }
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
            onClick={(e) => { e.preventDefault(); handleFormSubmit(e) }}
          >
            Create
          </button>
        </div>
      </div>
    </form>
  )
}
const AddTaskSleek = ({ onClose, setInputMode, setFormData }: any) => {
  const { transcript, isListening, setIsListening, handleTranscriptEdit } = useSTT();
  const handleTranscriptAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}${ENDPOINTS.POST.postTaskPrompt()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: transcript }),
    }).then(data => data.json()).then(data => {
      setFormData((prev: any) => ({ ...prev, ...data }))
      setInputMode('form');
    }).catch(err => {
      console.log(err);
    })
  }
  return (
    <div className="flex-1 flex flex-col px-6 pb-6">
      <div className="flex-1 relative flex items-center justify-center">
        <textarea
          value={transcript}
          onChange={(e) => handleTranscriptEdit(e.target.value)}
          placeholder="Create your task..."
          className="w-full h-full bg-transparent text-center text-lg font-light placeholder-gray-600 focus:outline-none resize-none text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-200 to-gray-400"
          style={{
            textShadow: '0 0 0 #e5e7eb',
            letterSpacing: '1px',
            lineHeight: '1.8',
          }}
        />
        {/* <VoiceReactiveOrb isListening={isListening} size="md" /> */}
      </div>

      <div className="flex items-center justify-center gap-4 pt-6">
        {/* <button
          type="button"
          className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400 transition-all duration-300 flex items-center justify-center text-black shadow-lg hover:shadow-gray-500/30"
        >
          <Pen className="w-5 h-5" />
        </button> */}

        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        {/* 
        <button
          type="button"
          className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400 transition-all duration-300 flex items-center justify-center text-black shadow-lg hover:shadow-gray-500/30"
          onClick={toggleListening}
        >
          <Mic className="w-5 h-5" />
        </button> */}

        <button
          onClick={() => setIsListening(prev => !prev)}
          className={`absolute z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isListening
            ? 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 text-black shadow-gray-500/40 hover:from-gray-400 hover:via-gray-300 hover:to-gray-400'
            : 'bg-gray-900 border border-gray-700 text-gray-400 hover:bg-gray-800'
            }`}
        >
          {isListening ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
        </button>
      </div>

      <div className="flex gap-3 pt-8 justify-center items-center">
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
          onClick={handleTranscriptAccept}
        >
          Accept
        </button>
      </div>
    </div>
  )
}
export function AddTask({ onClose, getTasks }: AddTaskModalProps) {
  const [inputMode, setInputMode] = useState<'sleek' | 'form'>('sleek');
  const tempDate = new Date(Date.now()).toISOString().split('T')[0];
  const [formData, setFormData] = useState<AddTaskFormInterface>({
    title: '',
    description: '',
    priority: '',
    tags: [],
    dueDate: tempDate,
    assignee: '',
    status: '',
  });
  const [tagInput, setTagInput] = useState('');

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}${ENDPOINTS.POST.postTask()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(data => data.json()).then(data => {
      if (data.status !== 'failure') {
        getTasks();
      }
    }).catch(err => {
      console.log(err);
    })
    onClose(undefined);
  };
  return (
    <>
      <div className="bg-gradient-to-b from-gray-950 to-black border border-gray-800 rounded-2xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-black/50">
        <div className="flex justify-between items-center p-6">
          <div className="flex gap-2">
            <button
              onClick={() => setInputMode('sleek')}
              className={`flex-1 py-2.5 px-4 rounded-full font-medium text-sm transition-all ${inputMode === 'sleek'
                ? 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 text-black shadow-lg shadow-gray-500/30'
                : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
                }`}
            >
              Sleek
            </button>
            <button
              onClick={() => setInputMode('form')}
              className={`flex-1 py-2.5 px-4 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2 ${inputMode === 'form'
                ? 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 text-black shadow-lg shadow-gray-500/30'
                : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
                }`}
            >
              <Type className="w-4 h-4" />
              Form
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors ml-4"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {inputMode === 'sleek' ? (
          <AddTaskSleek onClose={onClose} setInputMode={setInputMode} setFormData={setFormData} />
        ) : (
          <AddTaskForm onClose={onClose} handleFormSubmit={handleFormSubmit} formData={formData} setFormData={setFormData} tagInput={tagInput} setTagInput={setTagInput} />
        )}
      </div>
    </>
  );
}
