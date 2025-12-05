import express, { Request, Response } from 'express';
import { initDb, getDb } from './database';
const { createTaskInputObject, createTaskGetObject, createTaskUpdateObject, dbToResponseObject } = require('../schema/schema-task');
const app = express();
const port = 80;

app.use(express.json());

initDb();

app.get('/', (req: Request, res: Response) => {
    res.json('json server is up');
});

app.get('/tasks', async (req: Request, res: Response) => {
    const db = await getDb();
    const { id, status, priority, dueDate, search, assignee } = req.query;
    const task = createTaskGetObject({ id, status, priority, dueDate, search, assignee });

    const tasks = [];
    if (Object.keys(task).length > 0) {
        let queryResult = await db.all(`SELECT * FROM tasks where ${Object.entries(task).map(([key, value]) => `${key} = ${value}`).join(" and ").trimEnd()}`);
        tasks.push(...queryResult);
    } else {
        tasks.push(...await db.all('SELECT * FROM tasks'));
    }
    tasks.forEach((task, index) => {
        tasks[index] = dbToResponseObject(task);
    })

    res.json(tasks);
});


app.post('/task', async (req: Request, res: Response) => {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = createTaskInputObject({ title, description, status, priority, dueDate, tags });
    console.log(task);
    const db = await getDb();
    const result = await db.run('INSERT INTO tasks (title, description, status, priority, due_date, tags, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [task.title, task.description, task.status, task.priority, task.due_date, task.tags, task.updated_at]);
    console.log('dbpost result', result);
    res.json({ id: result.lastID, title });
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = createTaskUpdateObject({ title, description, status, priority, dueDate, tags });
    const db = await getDb();
    if (Object.keys(task).length > 0) {
        console.log(`UPDATE tasks SET ${Object.entries(task).map(([key, value]) => `${key} = ${value}`).join(", ").trimEnd()} WHERE id = ?`);
        const result = await db.run(`UPDATE tasks SET ${Object.entries(task).map(([key, value]) => `${key}= '${value}'`).join(", ")} WHERE id = ?`, id);
    }
    res.json({ status: 'success' });
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const db = await getDb();
    const result = await db.run('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ status: 'success' })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
