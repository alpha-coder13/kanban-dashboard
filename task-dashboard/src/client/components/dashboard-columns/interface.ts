import { ReactNode } from "react";
import { TaskInterface } from "../dashboard-tasks/interface";

export default interface ColumnParameters{
    id: any,
    color:String,
    title: String,
    count: String,
    children:ReactNode
    draggedRef:React.Ref<EventTarget>,
    dragDropTasks:Function
}