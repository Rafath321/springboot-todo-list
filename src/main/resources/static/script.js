document.addEventListener("DOMContentLoaded", fetchTasks);

const taskForm = document.getElementById("taskForm");

taskForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;

    const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, completed: false })
    });

    if (response.ok) {
        fetchTasks();
        taskForm.reset();
    }
});

async function fetchTasks() {
    const response = await fetch("http://localhost:8080/api/tasks");
    const tasks = await response.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.completed ? "✅ Completed" : "❌ Pending"}</td>
            <td>
                <button onclick="updateTask(${task.id})">Update</button>
                <button onclick="markCompleted(${task.id})">Mark Completed</button>
                <button onclick="viewTask(${task.id})">View</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        taskList.appendChild(row);
    });
}

async function updateTask(id) {
    const newTitle = prompt("Enter new title:");
    const newDescription = prompt("Enter new description:");

    if (newTitle && newDescription) {
        await fetch(`http://localhost:8080/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, description: newDescription, completed: false })
        });
        fetchTasks();
    }
}

async function markCompleted(id) {
    await fetch(`http://localhost:8080/api/tasks/${id}/complete`, {
        method: "PUT"
    });
    fetchTasks();
}

function viewTask(taskId) {
    fetch(`http://localhost:8080/tasks/${taskId}`)  // Ensure correct backend URL
        .then(response => response.json())
        .then(task => {
            alert(`Task: ${task.title}\nDescription: ${task.description}\nStatus: ${task.completed ? "Completed" : "Pending"}`);
        })
        .catch(error => console.error("Error fetching task details:", error));
}


async function deleteTask(id) {
    await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "DELETE"
    });
    fetchTasks();
}
