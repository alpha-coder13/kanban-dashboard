'use client'
import { Calendar, MoreVertical, Plus } from "lucide-react";
import React, { useEffect, useRef } from "react";
import ColumnParameters from "./interface";

export const Columns  = ({id, color,title,count, children,draggedRef,dragDropTasks} : ColumnParameters) =>{
  const columnContainerRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(columnContainerRef.current){
      columnContainerRef.current.addEventListener('dragover',(e)=>{
        e.preventDefault();
      })
      columnContainerRef.current.addEventListener('drop',(e)=>{
        if(columnRef.current){
          const data = JSON.parse(e.dataTransfer?.getData('text') || '');
          if(data){
            dragDropTasks(data.taskDetails, id, data.colOld)
          }
          // console.log(data);

        }
      })
    }
  },[columnContainerRef,draggedRef,columnRef])
    return (
         <div className="flex flex-col" ref={columnContainerRef}>
              <div className={`bg-gradient-to-br ${color} rounded-t-xl border border-gray-800 border-b-0 p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h2 className="font-medium text-white">{title}</h2>
                    <span className="px-2 py-0.5 bg-black/30 rounded-full text-xs text-gray-300 border border-white/10">
                      {count}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-950/50 border border-gray-800 border-t-0 rounded-b-xl p-3 flex-1">
                <div className="space-y-3" id={`${title}-${id}`} ref={columnRef}>
                  {children}
                </div>
              </div>
            </div>
    )
}