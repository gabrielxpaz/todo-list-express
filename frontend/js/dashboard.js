const logoutButton = document.querySelector("#logout-btn");
const user = document.querySelector("#user");
const decoded = jwt_decode(localStorage.getItem("token"));
const addTaskButton = document.querySelector('#add-task-btn');
const removeTaskButtons = document.querySelectorAll(".delete-btn");
const newTask = document.querySelector('#new-task');
const editModal = document.querySelector("#edit-modal");
const editInput = document.querySelector("#edit-task-input");
const saveEditBtn = document.querySelector("#save-edit-btn");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let currentTaskId = null;
let currentTaskElement = null;

user.innerHTML = decoded.username;

document.addEventListener("DOMContentLoaded", async (e) => {
    const taskList = document.querySelector("#task-list");
    const response = await fetch("http://localhost:3000/api/tasks", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    const data = await response.json();
    console.log(data);
    if (data.length === 0) {
        taskList.innerHTML = "<p>Nenhuma tarefa encontrada!</p>";
    } else {
        data.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.innerHTML = `
                <p>${task.title}</p>
                <div class="task-actions">
                    <button class="complete-btn" data-id="${task.id}">Concluir</button>
                    <button class="edit-btn" data-id="${task.id}">Editar</button>
                    <button class="delete-btn" data-id="${task.id}">Excluir</button>
                </div>
            `;
            taskList.appendChild(taskItem);

            if (task.completed) {
                const taskTitle = taskItem.querySelector("p");
                taskTitle.style.textDecoration = "line-through";
                const completeBtn = taskItem.querySelector(".complete-btn");
                completeBtn.disabled = true;
            }

            addDeleteListener(taskItem);
            addEditListener(taskItem);
            addCompleteListener(taskItem);
        });
    }
});


function addDeleteListener(taskItem) {
    const removeTaskButton = taskItem.querySelector(".delete-btn");
    removeTaskButton.addEventListener("click", async () => {
        const taskId = removeTaskButton.getAttribute("data-id");

        const confirmDelete = confirm("Tem certeza que deseja excluir esta tarefa?");
        if (!confirmDelete) return;

        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
            taskItem.remove();
        } else {
            alert("Erro ao excluir a tarefa.");
        }
    });
}

addTaskButton.addEventListener("click", async (e) => {
    const taskTitle = newTask.value;
    const taskList = document.querySelector("#task-list");
    if (taskTitle === "") {
        alert("Por favor, insira um título para a tarefa.");
        return;
    }
    const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title: taskTitle })
    });
    if (taskList.innerHTML == "<p>Nenhuma tarefa encontrada!</p>") {
        taskList.innerHTML = "";
    };
    const data = await response.json();

    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
        <p>${data.title}</p>
        <div class="task-actions">
            <button class="complete-btn" data-id="${data.id}">Concluir</button>
            <button class="edit-btn" data-id="${data.id}">Editar</button>
            <button class="delete-btn" data-id="${data.id}">Excluir</button>
        </div>
    `;
    document.querySelector("#task-list").appendChild(taskItem);
    addDeleteListener(taskItem);
    addCompleteListener(taskItem);
});

function addEditListener(taskItem) {
    const editBtn = taskItem.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
        const taskId = editBtn.getAttribute("data-id");
        const taskTitle = taskItem.querySelector("p").textContent;

        currentTaskId = taskId;
        currentTaskElement = taskItem;

        editInput.value = taskTitle;
        editModal.classList.remove("hidden");
    });
}

saveEditBtn.addEventListener("click", async () => {
    const newTitle = editInput.value.trim();
    if (newTitle === "") {
        alert("O título não pode estar vazio.");
        return;
    }

    const response = await fetch(`http://localhost:3000/api/tasks/${currentTaskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: newTitle }),
    });

    if (response.ok) {
        const updatedData = await response.json();
        currentTaskElement.querySelector("p").textContent = updatedData.title;
        editModal.classList.add("hidden");
    } else {
        alert("Erro ao atualizar a tarefa.");
    }
});

cancelEditBtn.addEventListener("click", () => {
    editModal.classList.add("hidden");
});

function addCompleteListener(taskItem) {
    const completeBtn = taskItem.querySelector(".complete-btn");
    completeBtn.addEventListener("click", async () => {
        const taskId = completeBtn.getAttribute("data-id");

        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ completed: true })
        });

        if (response.ok) {
            const updatedData = await response.json();
            const taskTitle = taskItem.querySelector("p");
            taskTitle.style.textDecoration = "line-through";
            completeBtn.disabled = true;
        } else {
            alert("Erro ao concluir a tarefa.");
        }
    });
}

logoutButton.addEventListener("click", (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "../pages/index.html";
});
