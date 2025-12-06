export const ENDPOINTS = {
    "GET": {
        "getTasks": (queryParams: any) => "/tasks?" + (queryParams || ''),
        "getTaskById": (id: String) => `/tasks/${id}`,
        "getTasksByStatus": (status: String) => `/tasks/?status=${status}`,
        "getTasksByPriority": (priority: String) => `/tasks/?priority=${priority}`,
        "getTasksByDueDate": (dueDate: String) => `/tasks/?dueDate=${dueDate}`,
        "getTasksBySearch": (search: String) => `/tasks/?search=${search}`,
    },
    "POST": {
        "postTask": () => "/task",
        "postTaskPrompt": () => "/task/prompt",
    },
    "PUT": {
        "putTask": (id: any) => `/tasks/${id}`,
    },
    "DELETE": {
        "deleteTask": (id: String) => `/tasks/${id}`,
    },
}

export const API_BASE_URL = '/api';