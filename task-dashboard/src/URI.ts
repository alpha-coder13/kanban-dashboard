export const ENVIRONMENT = process.env.MODE || 'development';
export const ENDPOINTS = {
    "GET": {
        "getTasks": () => "/tasks",
        "getTaskById": (id: String) => `/tasks/${id}`,
        "getTasksByStatus": (status: String) => `/tasks/?status=${status}`,
        "getTasksByPriority": (priority: String) => `/tasks/?priority=${priority}`,
        "getTasksByDueDate": (dueDate: String) => `/tasks/?dueDate=${dueDate}`,
        "getTasksBySearch": (search: String) => `/tasks/?search=${search}`,
    },
    "POST": {
        "postTask": () => "/tasks",
    },
    "PUT": {
        "putTask": (id: String) => `/tasks/${id}`,
    },
    "DELETE": {
        "deleteTask": (id: String) => `/tasks/${id}`,
    },
}

export const API_BASE_URL = ENVIRONMENT === 'development' ? "http://localhost:3000" : process.env.API_BASE_URL;