'use client'
import { Calendar, MoreVertical, Plus } from "lucide-react";
import React from "react";
import ColumnParameters from "./interface";

export const Columns  = ({id, color,title,count, children} : ColumnParameters) =>{
    return (
         <div className="flex flex-col">
              <div className={`bg-gradient-to-br ${color} rounded-t-xl border border-gray-800 border-b-0 p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h2 className="font-medium text-white">{title}</h2>
                    <span className="px-2 py-0.5 bg-black/30 rounded-full text-xs text-gray-300 border border-white/10">
                      {count}
                    </span>
                  </div>
                  <button className="text-gray-300 hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-950/50 border border-gray-800 border-t-0 rounded-b-xl p-3 flex-1">
                <div className="space-y-3">
                  {children}
                </div>
              </div>
            </div>
    )
}