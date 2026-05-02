const API = "https://team-task-manager-production-f155.up.railway.app";

function login() {
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();

if (!email || !password) {
alert("Please enter email and password");
return;
}

fetch(`${API}/login`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ email, password })
})
.then(res => {
if (!res.ok) throw new Error("Login failed");
return res.text();
})
.then(data => {
alert(data);
if (data.toLowerCase().includes("success")) {
window.location.href = "dashboard.html";
}
})
.catch(err => {
console.error(err);
alert("Login failed or server error");
});
}

function createProject() {
const name = document.getElementById("projectName").value.trim();

if (!name) {
alert("Enter project name");
return;
}

fetch(`${API}/create-project`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
name,
createdBy: "[simran@test.com](mailto:simran@test.com)"
})
})
.then(res => res.text())
.then(data => {
alert(data);
document.getElementById("projectName").value = "";
})
.catch(() => {
alert("Error creating project");
});
}

function createTask() {
const title = document.getElementById("taskTitle").value.trim();
const description = document.getElementById("taskDesc").value.trim();
const assignedTo = document.getElementById("assignedTo").value.trim();
const projectId = document.getElementById("projectId").value.trim();

if (!title || !assignedTo || !projectId) {
alert("Fill all required fields");
return;
}

fetch(`${API}/create-task`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
title,
description,
assignedTo,
projectId
})
})
.then(res => res.text())
.then(data => {
alert(data);
loadTasks();
loadStats();
})
.catch(() => {
alert("Error creating task");
});
}

function loadTasks() {
fetch(`${API}/tasks`)
.then(res => res.json())
.then(data => {
const taskList = document.getElementById("taskList");
taskList.innerHTML = "";

```
  data.forEach(task => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.margin = "10px 0";

    div.innerHTML = `
      <b>${task.title}</b><br>
      ${task.description || ""}<br>
      Assigned: ${task.assignedTo}<br>
      Status: ${task.status}<br><br>
      ${
        task.status !== "Done"
          ? `<button onclick="markDone('${task._id}')">Mark Done</button>`
          : `<span style="color:green;">✔ Completed</span>`
      }
      <button onclick="deleteTask('${task._id}')" style="background:red; color:white; margin-left:10px;">
        Delete
      </button>
    `;
    taskList.appendChild(div);
  });
})
.catch(err => console.error(err));
```

}

function loadStats() {
fetch(`${API}/dashboard`)
.then(res => res.json())
.then(data => {
document.getElementById("totalCount").innerText = data.total || 0;
document.getElementById("todoCount").innerText = data.todo || 0;
document.getElementById("doneCount").innerText = data.done || 0;
})
.catch(err => console.error(err));
}

function markDone(id) {
fetch(`${API}/update-task`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
taskId: id,
status: "Done"
})
})
.then(res => res.text())
.then(data => {
alert(data);
loadTasks();
loadStats();
})
.catch(err => console.error(err));
}

function deleteTask(id) {
fetch(`${API}/delete-task`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ taskId: id })
})
.then(res => res.text())
.then(data => {
alert(data);
loadTasks();
loadStats();
})
.catch(err => console.error(err));
}

window.onload = function () {
if (document.getElementById("taskList")) {
loadTasks();
loadStats();
}
};
