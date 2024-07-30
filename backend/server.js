const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let tasks = []; // In-memory array for tasks

// Function to validate ISO 8601 date format
function isISO8601(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

app.post('/api/tasks', (req, res) => {
    const { name, dueDate } = req.body;
    console.log(`Received task: ${name}, Due Date: ${dueDate}`);

    if (name && dueDate) {
        // Check if dueDate is in ISO 8601 format
        if (!isISO8601(dueDate)) {
            return res.status(400).json({ error: 'Invalid due date format (ISO 8601 expected)' });
        }

        const newTask = { id: tasks.length + 1, name, dueDate };
        tasks.push(newTask);
        res.status(201).json(newTask);
    } else {
        res.status(400).send('Invalid data');
    }
});

app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    tasks = tasks.filter(task => task.id !== taskId);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
