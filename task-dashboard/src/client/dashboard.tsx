'use client'
import React, { useState } from "react";
import {  Filter, Search } from "lucide-react";
import { Columns } from "./components/dashboard-columns/dashboard-columns";
import ColumnParameters from "./components/dashboard-columns/interface";
import { TaskBannerInterface } from "./components/dashboard-tasks/interface";
import { TaskBanner } from "./components/dashboard-tasks/dashboard-tasks";

export default function Homepage(){

    const [columns, setColumns]  = useState([
    { id: 1, title: 'Backlog', count: 12, color: 'from-gray-700 to-gray-800' },
    { id: 2, title: 'In Progress', count: 5, color: 'from-slate-700 to-slate-800' },
    { id: 3, title: 'Review', count: 3, color: 'from-zinc-700 to-zinc-800' },
    { id: 4, title: 'Completed', count: 8, color: 'from-neutral-700 to-neutral-800' },
  ]);
    const [tasks,setTaskts] = useState({
    1: [
      { id: 1, title: 'Redesign landing page', description: 'Create new hero section with better CTAs', priority: 'high', assignee: 'JD', tags: ['Design', 'UI'], dueDate: 'Mar 15' },
      { id: 2, title: 'Implement authentication', description: 'Add OAuth providers and email login', priority: 'medium', assignee: 'SK', tags: ['Backend', 'Security'], dueDate: 'Mar 18' },
      { id: 3, title: 'Database optimization', description: 'Optimize slow queries and add indexes', priority: 'low', assignee: 'AM', tags: ['Database'], dueDate: 'Mar 20' },
    ],
    2: [
      { id: 4, title: 'API integration', description: 'Connect third-party payment gateway', priority: 'high', assignee: 'JD', tags: ['Backend', 'API'], dueDate: 'Mar 12' },
      { id: 5, title: 'Mobile responsiveness', description: 'Ensure all pages work on mobile devices', priority: 'medium', assignee: 'LM', tags: ['Frontend', 'Mobile'], dueDate: 'Mar 14' },
    ],
    3: [
      { id: 6, title: 'Performance audit', description: 'Review and improve page load times', priority: 'high', assignee: 'SK', tags: ['Performance'], dueDate: 'Mar 10' },
    ],
    4: [
      { id: 7, title: 'User onboarding flow', description: 'Create step-by-step tutorial for new users', priority: 'medium', assignee: 'AM', tags: ['UX', 'Design'], dueDate: 'Mar 08' },
      { id: 8, title: 'Email notifications', description: 'Set up transactional email system', priority: 'low', assignee: 'JD', tags: ['Backend'], dueDate: 'Mar 05' },
    ],
  });
    return (
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
            <button className="px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-black rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all duration-300 font-medium text-sm shadow-lg shadow-gray-500/20 hover:shadow-gray-400/30 hover:-translate-y-0.5">
              New Task
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-sm placeholder-gray-600"
                />
              </div>
              <button className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-all duration-200 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[2000px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {columns.map((column :ColumnParameters) => (
           <Columns id = {parseInt(column.id)} key={column.id} title={column.title} color={column.color} count={(column.count).toString()} >
            {tasks[column.id as keyof typeof tasks]?.map(({id,tags,description,dueDate,priority,assignee,title}:TaskBannerInterface)=>(
                <TaskBanner id={id} key={id} tags={tags} description={description} dueDate={dueDate} priority={priority} assignee={assignee} title={title}/>
            ))}
           </Columns>
          ))}
        </div>
      </div>
    </div>
  );
}