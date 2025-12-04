export interface TaskInterface {
    id: Number,
    tags: Array<String>,
    description: String,
    dueDate: String,
    priority: Priority,
    assignee: String,
    title: String
    draggedRef: React.Ref<EventTarget>,
    columnId: number,
    createdAt: Date,
    updatedAt: Date
}

enum Priority {
    "critical" = "DARK RED",
    "high" = "RED",
    "medium" = "ORANGE",
    "todo" = "YELLOW",
    "in progress" = "BLUE",
    "low" = "LIGHT GREEN",
    "delivered" = "DARK GREEN",
    "discarded" = "GRAY",
}