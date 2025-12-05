import { TaskInterface } from "../dashboard-tasks/interface";

export interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  addTask: (task: TaskInterface | String) => void;
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