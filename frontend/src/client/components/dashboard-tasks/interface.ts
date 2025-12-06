export interface TaskInterface {
    id: Number,
    tags: string[],
    description: String,
    dueDate: String,
    priority: string,
    assignee: String,
    title: String
    draggedRef: React.Ref<EventTarget>,
    columnId: number,
    createdAt: Date,
    updatedAt: Date
    openUpdateModal: (e: React.MouseEvent<HTMLButtonElement>, task: any) => void,
    status: string
}

