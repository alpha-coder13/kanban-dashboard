interface Task {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    tags: string[];
    assignee: string;
}

interface TaskSchema {
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    tags: string;
    updated_at: string;
    assignee: string;
}

interface TaskSchemaWithId extends TaskSchema {
    id: number;
}

interface TaskWithId extends Task {
    id: number;
}
const createTaskInputObject = (task: Task): TaskSchema => {
    return {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.dueDate,
        tags: task.tags.join(","),
        updated_at: new Date().toISOString().replace("T", " ").replace("Z", ""),
        assignee: task.assignee || '',
    };
}

const getEquivalentSchemaKey = (key: keyof Task): keyof TaskSchema => {
    switch (key) {
        case 'dueDate':
            return 'due_date';
        case 'tags':
            return 'tags';
        default:
            return key;
    }
}
const createTaskGetObject = (task: Task): any => {
    const queryObject: any = {};
    Object.keys(task).forEach(key => {
        if (task[key as keyof Task] && task[key as keyof Task] !== 'undefined') {
            queryObject[getEquivalentSchemaKey(key as keyof Task)] = task[key as keyof Task];
        }
    });
    return { ...queryObject };
}

const dbToResponseObject = (task: TaskSchemaWithId): TaskWithId => {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        tags: task.tags.split(",").filter((tag) => tag.trim() !== ""),
        assignee: task.assignee,
    };
}
const createTaskUpdateObject = (task: Task): any => {
    const returnObject: any = {};
    Object.keys(task).forEach(key => {
        if (task[key as keyof Task] && task[key as keyof Task] !== 'undefined' && task[key as keyof Task] !== '') {
            returnObject[getEquivalentSchemaKey(key as keyof Task)] = task[key as keyof Task];
        }
    });
    return { ...returnObject };
}

export {
    createTaskInputObject,
    createTaskGetObject,
    createTaskUpdateObject,
    dbToResponseObject
}