import { TaskInterface } from "../dashboard-tasks/interface";

export interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  addTask: (task: TaskInterface | String) => void;
}

