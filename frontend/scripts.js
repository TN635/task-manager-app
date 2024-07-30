document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const taskDueDate = document.getElementById('taskDueDate').value;
        const taskDueTime = document.getElementById('taskDueTime').value;

        // Combine date and time into a single ISO 8601 string
        const combinedDateTime = `${taskDueDate}T${taskDueTime}:00`;

        console.log(`Submitting task: ${taskName}, Due Date: ${combinedDateTime}`);

        if (!taskName || !taskDueDate || !taskDueTime) {
            alert('Please enter task name, due date, and due time.');
            return;
        }

        const response = await fetch('http://localhost:3001/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: taskName, dueDate: combinedDateTime }),
        });

        if (response.ok) {
            loadTasks();
            taskForm.reset();
        } else {
            alert('Failed to add task');
        }
    });

    taskList.addEventListener('click', async (e) => {
        if (e.target.tagName === 'BUTTON') {
            const taskId = e.target.parentElement.dataset.id;

            const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                loadTasks();
            } else {
                alert('Failed to delete task');
            }
        }
    });

    async function loadTasks() {
        const response = await fetch('http://localhost:3001/api/tasks');
        const tasks = await response.json();
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            const taskText = document.createElement('span');
            const dueDate = new Date(task.dueDate);

            console.log(`Task due date received: ${task.dueDate}, Parsed date: ${dueDate}`);

            if (isNaN(dueDate.getTime())) {
                taskText.textContent = `${task.name} - Due: Invalid Date`;
            } else {
                taskText.textContent = `${task.name} - Due: ${dueDate.toLocaleString()}`;
            }

            li.appendChild(taskText);
            li.dataset.id = task.id;
            const button = document.createElement('button');
            button.textContent = 'Delete';
            li.appendChild(button);
            taskList.appendChild(li);
        });
    }

    loadTasks();
});
