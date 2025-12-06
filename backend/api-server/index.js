import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { LLMRequests } from './llmParsing.js';
import { request } from 'http';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path:path.join(import.meta.dirname,'.env')});
import http from 'http';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const statuses = ["TO DO", "IN PROGRESS", "REJECTED", "COMPLETED"];
const priorities = ["Low", "Medium", "High"];
const inMemoryTaskID = new Map();

// let tasks = Array.from({ length: 10 }, (_, i) => ({
//     id: String(i + 1),
//     title: `Task ${i + 1}`,
//     description: `Description for task ${i + 1}`,
//     status: Math.floor(Math.random() * statuses.length) + 1,
//     priority: priorities[Math.floor(Math.random() * priorities.length)],
//     dueDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
//     tags: [],
//     assignee: `${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}`,
// }));


app.post('/task', (req, res) => {
    const { title, description, status, priority, dueDate,assignee ,tags} = req.body;
    const newTask = {
        title:title || '',
        description:description || '',
        status: status || 'TO DO',
        priority:priority || 'Low',
        dueDate : dueDate || new Date(Date.now()).toISOString(),
        assignee:assignee || '',
        tags:tags || [],
    };
    const requestJSONstring  =JSON.stringify(newTask);
    console.log(requestJSONstring);
    let postRequest = http.request({
        hostname: `${process.env.DATABASE_SERVER_ENDPOINT}`,
        port: process.env.DATABASE_SERVER_PORT,
        path: '/task',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestJSONstring.length
        },
    },(response)=>{
        let task = '';
        response.on('data', (chunk) => {
            task += chunk;
        });
        response.on('end', () => {
            try{
                let temptask = JSON.parse(task);
                console.log(temptask);
                res.status(201).json(temptask);
            }catch(err){
                console.log(err);
                res.status(500).send({status:'error',message:err.message});
            }
        });
    })
   postRequest.on('error', (error) => {
        console.error(error);
        console.log(error.stack);
        res.status(500).send({status:'error',message:error.message});
    })
    postRequest.write(requestJSONstring)
    postRequest.end();
});

app.post('/task/prompt', async (req, res) => {
    const { input } = req.body;
    try{
        let response = await LLMRequests(input);
        const newTask = {
            title:response.title ||'',
            description:response.description ||'',
            status: response.status || 'TODO' ,
            priority : response.priority || 'low',
            dueDate:response.dueDate || '',
            tags:response.tags.split('|').filter((tag) => tag !== '') || [],
            assignee:response.assignee || '',
        };
        res.status(201).json(newTask);
    }catch(err){
        res.status(424).json({status:'error',message:err.message});
    }

});

app.get('/tasks',(req,res)=>{
    let { status, priority, dueDate, searchString, assignee } = req.query;
    let queryParameters = new URLSearchParams({status,priority,dueDate,assignee});
    let getRequest = request({
            hostname: `${process.env.DATABASE_SERVER_ENDPOINT}`,
            port: process.env.DATABASE_SERVER_PORT,
            path: `/tasks?${queryParameters.toString()}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

    getRequest.on('response', (response) => {
        let tasks = '';
        response.on('data', (chunk) => {
            tasks += chunk;
        });
        response.on('end', () => {
            try{
                let temptask = JSON.parse(tasks);
                if(typeof temptask == 'object' && temptask instanceof Array){
                    if (searchString) {
                        const query = searchString.toLowerCase();
                        temptask = temptask.filter(t =>
                            (t.title && t.title.toLowerCase().includes(query)) ||
                            (t.description && t.description.toLowerCase().includes(query))
                        );
                    }
                }
                res.json(temptask);
            }catch(err){
                console.log(err);
                res.status(500).json({status:'error',message:err.message});
            }
        });
    });

    getRequest.on('error', (error) => {
        console.error(error);
        res.status(500).json({status:'error',message:error.message});
    });

    getRequest.end();
})
app.get('/tasks/:id', (req, res) => {
    let id = req.params.id;
    let { status, priority, dueDate, searchString, assignee } = req.query;
    let queryParameters = new URLSearchParams({id,status,priority,dueDate,assignee});
    let getRequest = request({
            hostname: `${process.env.DATABASE_SERVER_ENDPOINT}`,
            port: process.env.DATABASE_SERVER_PORT,
            path: `/tasks?${queryParameters.toString()}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

    getRequest.on('response', (response) => {
        let tasks = '';
        response.on('data', (chunk) => {
            tasks += chunk;
        });
        response.on('end', () => {
            try{
                let temptask = JSON.parse(tasks);
                if(typeof temptask == 'object' && temptask instanceof Array){
                    if (searchString) {
                        const query = searchString.toLowerCase();
                        temptask = temptask.filter(t =>
                            (t.title && t.title.toLowerCase().includes(query)) ||
                            (t.description && t.description.toLowerCase().includes(query))
                        );
                    }
                }
                res.json(temptask);
            }catch(err){
                console.log(err);
                res.status(500).json({status:'error',message:err.message});
            }
        });
    });

    getRequest.on('error', (error) => {
        console.error(error);
        res.status(500).json({status:'error',message:error.message});
    });

    getRequest.end();
});


app.put('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const requestJSONstring = JSON.stringify(req.body);
    
    let putRequest = http.request({
        hostname: `${process.env.DATABASE_SERVER_ENDPOINT}`,
        port: process.env.DATABASE_SERVER_PORT,
        path: `/tasks/${id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestJSONstring.length
        },
    }, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            try {
                const result = JSON.parse(data);
                res.json(result);
            } catch (err) {
                console.log(err);
                res.status(500).json({status:'error',message:err.message});
            }
        });
    });

    putRequest.on('error', (error) => {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    });

    putRequest.write(requestJSONstring);
    putRequest.end();
});


app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    
    let deleteRequest = http.request({
        hostname: `${process.env.DATABASE_SERVER_ENDPOINT}`,
        port: process.env.DATABASE_SERVER_PORT,
        path: `/tasks/${id}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            try {
                const result = JSON.parse(data);
                console.log(result);
                res.status(200).json(result);
            } catch (err) {
                console.log(err);
                res.status(500).json({status:'error',message: err.message});
            }
        });
    });

    deleteRequest.on('error', (error) => {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    });

    deleteRequest.end();
});

app.listen(port,'0.0.0.0', () => {
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