'use client'
import React, { useEffect, useRef, useState } from "react";
import { Filter, Search } from "lucide-react";
import { Columns } from "./components/dashboard-columns/dashboard-columns";
import ColumnParameters from "./components/dashboard-columns/interface";
import { TaskInterface } from "./components/dashboard-tasks/interface";
import { TaskBanner } from "./components/dashboard-tasks/dashboard-tasks";
import { ENDPOINTS, API_BASE_URL } from "../URI";
import { useDashBoardContext } from "./Store/container";
import { AddTask } from "./components/dashboard-addTask/dashboard-addTask";
import { TaskFilter } from "./components/dashboard-filter/dashboard-filter";

export default function Homepage() {
  const draggedRef = useRef<EventTarget>(null);
  const dragDropTasks = async (taskData: TaskInterface, columnIdNew: number, columnIdOld: number) => {
    taskData.updatedAt = new Date();
    let updateTaskResponse = await updateTask({ ...taskData, status: STATUS_CODE_TO_STATUS_TEXT[columnIdNew] });
    if (updateTaskResponse.data) {
      taskData.status = columnIdNew;
      const updateTasksStates = (prevState: any) => {
        const newState = { ...prevState };

        newState[columnIdOld] = newState[columnIdOld].reduce((prev, curr) => {
          if (curr.id !== taskData.id) {
            prev.push(curr);
          }
          return prev;
        }, []);
        if (newState[columnIdNew].indexOf((val) => { console.log(val); return parseInt(val.id) === parseInt(taskData.id) }) == -1) {
          newState[columnIdNew].push(taskData);
        }
        return newState
      };
      setTasks(updateTasksStates);
    } else {
      getTasks();
    }

  }
  const [tasks, setTasks] = useState({});

  enum STATUS {
    "TO_DO" = 1,
    "IN_PROGRESS" = 2,
    "REJECTED" = 3,
    "COMPLETED" = 4
  }

  const STATUS_CODE_TO_STATUS_TEXT = {
    1: 'To Do'.toUpperCase(),
    2: 'In Progress'.toUpperCase(),
    3: 'Rejected'.toUpperCase(),
    4: 'Completed'.toUpperCase()
  }


  const columns = [
    { id: 1, title: 'To Do', count: tasks[STATUS.TO_DO]?.length || 0, color: 'from-gray-700 to-gray-800' },
    { id: 2, title: 'In Progress', count: tasks[STATUS.IN_PROGRESS]?.length || 0, color: 'from-slate-700 to-slate-800' },
    { id: 3, title: 'Rejected', count: tasks[STATUS.REJECTED]?.length || 0, color: 'from-zinc-700 to-zinc-800' },
    { id: 4, title: 'Completed', count: tasks[STATUS.COMPLETED]?.length || 0, color: 'from-neutral-700 to-neutral-800' },
  ];



  const getTasks = async () => {
    fetch(API_BASE_URL + ENDPOINTS.GET.getTasks(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const tasks = {
          [STATUS.TO_DO]: [],
          [STATUS.IN_PROGRESS]: [],
          [STATUS.REJECTED]: [],
          [STATUS.COMPLETED]: [],
        };
        data.forEach((val) => {
          const status = val.status.split(' ').join('_');
          switch (STATUS[status]) {
            case STATUS.TO_DO:
              tasks[STATUS.TO_DO].push(val);
              break;
            case STATUS.IN_PROGRESS:
              tasks[STATUS.IN_PROGRESS].push(val);
              break;
            case STATUS.REJECTED:
              tasks[STATUS.REJECTED].push(val);
              break;
            case STATUS.COMPLETED:
              tasks[STATUS.COMPLETED].push(val);
              break;
            default:
              break;
          }
        })
        setTasks(tasks);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }

  let updateTask = async (taskData: TaskInterface) => {
    try {
      let response = await fetch(API_BASE_URL + ENDPOINTS.PUT.putTask(taskData.id.toString()), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...taskData }),
      }).then(response => response.json())
      return { status: "success", data: response };
    } catch (error) {
      return { status: "failure", message: error.message }
    }
  }
  const { modal } = useDashBoardContext();
  const onClose = (e: React.MouseEvent | undefined) => {
    modal.dispatch({ type: 'toggle' });
    if (e) {
      e.stopPropagation();
    }

  }
  const [modalChild, setModalChild] = useState<String | null>();
  const GetModalChildTSX = modalChild === 'newTask' ? AddTask : modalChild === 'filterTask' ? TaskFilter : () => (<></>);
  useEffect(() => {
    getTasks();
  }, []);
  return (
    <>
      {modal.state.isOpen && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <GetModalChildTSX onClose={onClose} />
      </div>)
      }
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-gray-800 bg-gradient-to-b from-black to-gray-950">
          <div className="max-w-[2000px] mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-light tracking-tight mb-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Project Dashboard
                </h1>
                <p className="text-gray-500 text-sm">Manage and track your team's workflow</p>
              </div>
              <button className="px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-black rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all duration-300 font-medium text-sm shadow-lg shadow-gray-500/20 hover:shadow-gray-400/30 hover:-translate-y-0.5"
                onClick={(e) => {
                  onClose(undefined);
                  setModalChild("newTask");
                }}>
                New Task
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-center justify-end">
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {/* <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-sm placeholder-gray-600"
                  />
                </div> */}
                <button className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-all duration-200 text-sm flex items-center gap-2"
                  onClick={(e) => {
                    onClose(undefined);
                    setModalChild("filterTask");
                  }}
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[2000px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {columns.map((column: ColumnParameters) => {
              return (
                <Columns id={parseInt(column.id)} key={column.id} title={column.title} color={column.color} count={(column.count).toString()} draggedRef={draggedRef} dragDropTasks={dragDropTasks}>
                  {tasks[parseInt(column.id)]?.map(({ id, tags, description, dueDate, priority, assignee, title }: TaskInterface) => (
                    <TaskBanner columnId={column.id} id={id} key={id} tags={tags} description={description} dueDate={dueDate} priority={priority} assignee={assignee} title={title} draggedRef={draggedRef} />
                  ))}
                </Columns>
              )
            }
            )}
          </div>
        </div>
      </div>
    </>
  );
}