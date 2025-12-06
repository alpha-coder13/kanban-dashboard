import { TaskInterface } from "../dashboard-tasks/interface";

export interface AddTaskModalProps {
  onClose: (any) => void;
  getTasks: () => Promise<void>;
  task: any;
}


export interface AddTaskFormInterface {
  title: string;
  description: string;
  priority: string;
  tags: string[];
  dueDate: string;
  assignee: string;
  status: string;
}