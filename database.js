import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBR03RmpL1Es5kdQsoecnExLAWCb-YWHME",
    authDomain: "task-manager-898af.firebaseapp.com",
    projectId: "task-manager-898af",
    storageBucket: "task-manager-898af.firebasestorage.app",
    messagingSenderId: "770005155353",
    appId: "1:770005155353:web:c08ce431ee89123d7e3488",
    measurementId: "G-2PYBS8H3DM"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userSearch = document.getElementById("user-input-search");
const todoContainer = document.getElementById("todo-container");
const createBtn = document.getElementById("create-task-btn");
const inProgressContainer = document.getElementById("in-progress-container");
const doneContainer = document.getElementById("done-container");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("save-btn");
const closeModalBtn = document.getElementById("close-modal-btn");

let edit = null;
createBtn.addEventListener("click", () => {
    edit = null;
    clearModalInputs();
    modal.style.display = "flex";
});
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
saveBtn.addEventListener('click', async () => {
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-description').value.trim();
    const assignedTo = document.getElementById('assigned-to').value.trim();
    if (!title) {
        alert("The title is required!");
        return;
    }
    try {
        if (edit) {
            const taskRef = doc(db, "tasks", edit);
            await updateDoc(taskRef, {
                title,
                description,
                assignedTo
            });
            console.log("Task updated:", edit);
        } else {
            await addDoc(collection(db, "tasks"), {
                title,
                description,
                assignedTo,
                status: "To Do",
            });
            console.log("Task created.");
        }

        modal.style.display = 'none';
        loadTasks();
    } catch (error) {
        console.error("Error saving task: ", error);
    }
});
async function loadTasks() {
    const snapshot = await getDocs(collection(db, "tasks"));
    todoContainer.innerHTML = '';
    inProgressContainer.innerHTML = '';
    doneContainer.innerHTML = '';

    snapshot.forEach(docSnap => {
        const task = docSnap.data();
        const taskCard = createTaskCard(task, docSnap.id);
        if (task.status === 'To Do') {
            todoContainer.appendChild(taskCard);
        } else if (task.status === 'In Progress') {
            inProgressContainer.appendChild(taskCard);
        } else {
            doneContainer.appendChild(taskCard);
        }
    });
}
function createTaskCard(task, id) {
    const card = document.createElement("div");
    card.classList.add("task-card");

    const title = document.createElement('h4');
    title.textContent = task.title;

    const description = document.createElement('p');
    description.textContent = task.description;

    const assigned = document.createElement('p');
    assigned.textContent = `Assigned to: ${task.assignedTo}`;

    const moveToInProgressBtn = document.createElement('button');
    moveToInProgressBtn.textContent = 'Move to In Progress';
    moveToInProgressBtn.addEventListener('click', () => moveTask(id, 'In Progress'));

    const moveToDoneBtn = document.createElement('button');
    moveToDoneBtn.textContent = 'Move to Done';
    moveToDoneBtn.addEventListener('click', () => moveTask(id, 'Done'));

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.backgroundColor = '#f39c12';
    editBtn.addEventListener('click', () => openEditModal(id, task));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.backgroundColor = '#e74c3c';
    deleteBtn.addEventListener('click', () => deleteTask(id));

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(assigned);
    card.appendChild(moveToInProgressBtn);
    card.appendChild(moveToDoneBtn);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);
    return card;

}
async function moveTask(id, newStatus) {
    try {
        const taskRef = doc(db, "tasks", id);
        await updateDoc(taskRef, { status: newStatus });
        loadTasks();
    } catch (e) {
        console.error("Error moving task: ", e);
    }
}
async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await deleteDoc(doc(db, "tasks", id));
            console.log("Task deleted:", id);
            loadTasks();
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    }
}
function openEditModal(id, task) {
    edit = id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description;
    document.getElementById('assigned-to').value = task.assignedTo;
    modal.style.display = 'flex';
}
function clearModalInputs() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('assigned-to').value = '';
}
loadTasks();