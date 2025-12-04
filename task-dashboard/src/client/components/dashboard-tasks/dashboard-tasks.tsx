import { Calendar, MoreVertical } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { TaskInterface } from "./interface";

export const TaskBanner = ({id, title, tags, dueDate, priority,assignee,description,draggedRef,columnId}:TaskInterface)=>{
    const taskRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
      if(taskRef.current){
        taskRef.current.addEventListener('dragstart',(e)=>{
          const taskData = JSON.stringify({taskDetails:{id,title,tags,dueDate,priority,assignee,description}, colOld:columnId})
          e.dataTransfer?.setData('text/plain',taskData)
        })
      }
    },[taskRef,draggedRef])
    return(
      <div
        className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all duration-300 group hover:shadow-lg hover:shadow-gray-900/50 cursor-pointer"
        ref={taskRef}
        draggable={true}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-white text-sm leading-tight flex-1 group-hover:text-gray-200 transition-colors">
            {title}
          </h3>
          <button className="text-gray-600 hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <p className="text-gray-500 text-xs mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-800/50 border border-gray-700/50 rounded text-xs text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dueDate}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs border ${priority.toLowerCase()}`}>
              {priority}
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-xs font-medium text-black shadow-lg">
            {assignee}
          </div>
        </div>
      </div>
    )
}