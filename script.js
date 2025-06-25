const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBarInner");
const progressText = document.getElementById("progressText");
const statusFilter = document.getElementById("statusFilter");
const sortOrder = document.getElementById("sortOrder");

let tasks = [];

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const deadline = document.getElementById("deadline").value;
  const description = document.getElementById("description").value.trim();

  if (!title || !deadline) return alert("Title and deadline are required!");

  const newTask = {
    id: Date.now(),
    title,
    deadline,
    description,
    status: "Not Started",
  };

  tasks.push(newTask);
  taskForm.reset();
  renderTasks();
  updateProgress();
});

function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks
    .filter((task) =>
      statusFilter.value === "All" ? true : task.status === statusFilter.value
    )
    .sort((a, b) => {
      return sortOrder.value === "asc"
        ? new Date(a.deadline) - new Date(b.deadline)
        : new Date(b.deadline) - new Date(a.deadline);
    });

  filtered.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    if (new Date(task.deadline) < new Date() && task.status !== "Completed") {
      taskDiv.classList.add("overdue");
    }

    taskDiv.innerHTML = `
      <h3>${task.title}</h3>
      <p>Deadline: ${new Date(task.deadline).toLocaleString()}</p>
      ${task.description ? `<p>${task.description}</p>` : ""}
      <p>Status: <span class="status-badge">${task.status}</span></p>
      <div class="status">
        ${task.status !== "Completed" ? `
          <button onclick="updateStatus(${task.id}, 'In Progress')"><i class="fas fa-spinner"></i> In Progress</button>
          <button onclick="updateStatus(${task.id}, 'Completed')"><i class="fas fa-check"></i> Complete</button>
        ` : ""}
        <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;
    taskList.appendChild(taskDiv);
  });
}

function updateStatus(id, newStatus) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = newStatus;
    renderTasks();
    updateProgress();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
  updateProgress();
}

function updateProgress() {
  if (tasks.length === 0) {
    progressBar.style.width = "0%";
    progressText.textContent = "0% Completed";
    return;
  }

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const percent = Math.round((completed / tasks.length) * 100);

  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% Completed`;
}

statusFilter.addEventListener("change", () => {
  renderTasks();
});

sortOrder.addEventListener("change", () => {
  renderTasks();
});
