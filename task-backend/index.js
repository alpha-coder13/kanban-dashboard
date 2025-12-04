import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { LLMRequests } from './llmParsing.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const statuses = ["TODO", "INPROGRESS", "REJECTED", "COMPLETED"];
const priorities = ["Low", "Medium", "High"];

let tasks = Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    title: `Task ${i + 1}`,
    description: `Description for task ${i + 1}`,
    status: Math.floor(Math.random() * statuses.length) + 1,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    dueDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: `${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}`,
}));



let currentId = 11;

app.post('/tasks', (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    const newTask = {
        id: String(currentId++),
        title,
        description,
        status: status || 'TODO',
        priority,
        dueDate,
        createdAt: new Date()
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.post('/tasksPrompt', async (req, res) => {
    const { input } = req.body;
    try{
        let response = await LLMRequests(input);
        const newTask = {
            title:response.title ||'',
            description:response.description ||'',
            status: response.status || 'TODO' ,
            priority : response.priority || 'low',
            dueDate:response.dueDate || '',
        };
        res.status(201).json(newTask);
    }catch(err){
        res.status(424).json({});
    }

});

app.get('/tasks', (req, res) => {

    let { status, priority, dueDate, search, assignee } = req.query;
    let filteredTasks = tasks;

    if (status) {
        filteredTasks = filteredTasks.filter(t => t.status === status);
    }
    if (priority) {
        filteredTasks = filteredTasks.filter(t => t.priority === priority);
    }
    if (dueDate) {
        filteredTasks = filteredTasks.filter(t => t.dueDate === dueDate);
    }
    if (assignee) {
        filteredTasks = filteredTasks.filter(t => t.assignee.toLowerCase() === assignee.toLowerCase());
    }
    if (search) {
        const query = search.toLowerCase();
        filteredTasks = filteredTasks.filter(t =>
            (t.title && t.title.toLowerCase().includes(query)) ||
            (t.description && t.description.toLowerCase().includes(query))
        );
    }
    res.json(filteredTasks);
});

app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send();
    }
});

app.put('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body };
        res.json(tasks[index]);
    } else {
        res.status(404).send();
    }
});

app.patch('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body };
        res.json(tasks[index]);
    } else {
        res.status(404).send();
    }
});

app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        tasks.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


process.stdin.on('data', (data) => {
    let input = data.toString().trim();
    if (input.includes('get') && input.includes('tasks')) {
        console.log(tasks);

    }
    if (input.includes('delete')) {
        if (input.includes('all')) {
            tasks = [];
        } else {
            let ids = input.split(' -- ').slice(1);
            console.log(ids);
            let idArray = ids.split(',');
            tasks = tasks.filter(t => !idArray.includes(t.id));
        }
    }
    if (input.includes('exit')) {
        process.exit();
    }
});

process.on('exit', () => {
    console.log('Goodbye!');
});


process.on('SIGINT', () => {
    process.exit();
});