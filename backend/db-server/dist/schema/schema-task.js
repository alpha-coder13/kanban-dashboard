"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbToResponseObject = exports.createTaskUpdateObject = exports.createTaskGetObject = exports.createTaskInputObject = void 0;
const createTaskInputObject = (task) => {
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
};
exports.createTaskInputObject = createTaskInputObject;
const getEquivalentSchemaKey = (key) => {
    switch (key) {
        case 'dueDate':
            return 'due_date';
        case 'tags':
            return 'tags';
        default:
            return key;
    }
};
const createTaskGetObject = (task) => {
    const queryObject = {};
    Object.keys(task).forEach(key => {
        if (task[key] && task[key] !== 'undefined') {
            queryObject[getEquivalentSchemaKey(key)] = task[key];
        }
    });
    return Object.assign({}, queryObject);
};
exports.createTaskGetObject = createTaskGetObject;
const dbToResponseObject = (task) => {
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
};
exports.dbToResponseObject = dbToResponseObject;
const createTaskUpdateObject = (task) => {
    const returnObject = {};
    Object.keys(task).forEach(key => {
        if (task[key] && task[key] !== 'undefined' && task[key] !== '') {
            returnObject[getEquivalentSchemaKey(key)] = task[key];
        }
    });
    return Object.assign({}, returnObject);
};
exports.createTaskUpdateObject = createTaskUpdateObject;
