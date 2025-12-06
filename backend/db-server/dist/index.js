"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const { createTaskInputObject, createTaskGetObject, createTaskUpdateObject, dbToResponseObject } = require('./schema/schema-task');
const app = (0, express_1.default)();
const port = 80;
app.use(express_1.default.json());
(0, database_1.initDb)();
app.get('/', (req, res) => {
    res.json('json server is up');
});
app.get('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, database_1.getDb)();
    const { id, status, priority, dueDate, search, assignee } = req.query;
    const task = createTaskGetObject({ id, status, priority, dueDate, search, assignee });
    const tasks = [];
    if (Object.keys(task).length > 0) {
        let queryResult = yield db.all(`SELECT * FROM tasks where ${Object.entries(task).map(([key, value]) => `${key} = '${value}'`).join(" and ").trimEnd()}`);
        tasks.push(...queryResult);
    }
    else {
        tasks.push(...yield db.all('SELECT * FROM tasks'));
    }
    tasks.forEach((task, index) => {
        tasks[index] = dbToResponseObject(task);
    });
    res.json(tasks);
}));
app.post('/task', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = createTaskInputObject({ title, description, status, priority, dueDate, tags });
    console.log(task);
    const db = yield (0, database_1.getDb)();
    const result = yield db.run('INSERT INTO tasks (title, description, status, priority, due_date, tags, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [task.title, task.description, task.status, task.priority, task.due_date, task.tags, task.updated_at]);
    console.log('dbpost result', result);
    res.json({ id: result.lastID, title });
}));
app.put('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = createTaskUpdateObject({ title, description, status, priority, dueDate, tags });
    const db = yield (0, database_1.getDb)();
    if (Object.keys(task).length > 0) {
        console.log(`UPDATE tasks SET ${Object.entries(task).map(([key, value]) => `${key} = ${value}`).join(", ").trimEnd()} WHERE id = ?`);
        const result = yield db.run(`UPDATE tasks SET ${Object.entries(task).map(([key, value]) => `${key}= '${value}'`).join(", ")} WHERE id = ?`, id);
    }
    res.json({ status: 'success' });
}));
app.delete('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const db = yield (0, database_1.getDb)();
    const result = yield db.run('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ status: 'success' });
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
