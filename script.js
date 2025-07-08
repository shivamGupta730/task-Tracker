document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const titleInput = document.getElementById("title");
  const deadlineInput = document.getElementById("deadline");
  const descInput = document.getElementById("description");
  const taskList = document.getElementById("taskList");
  const statusFilter = document.getElementById("statusFilter");
  const sortOrder = document.getElementById("sortOrder");
  const progressBarInner = document.getElementById("progressBarInner");
  const progressText = document.getElementById("progressText");

  let tasks = [];

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const deadline = deadlineInput.value;
    const description = descInput.value.trim();

    if (!title || !deadline) return;

    const task = {
      id: Date.now(),
      title,
      deadline,
      description,
      status: "Not Started"
    };

    tasks.push(task);
    renderTasks();
    taskForm.reset();
  });

  statusFilter.addEventListener("change", renderTasks);
  sortOrder.addEventListener("change", renderTasks);

  function updateStatus(id, newStatus) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    );
    renderTasks();
  }

  function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
      tasks = tasks.filter(task => task.id !== id);
      renderTasks();
    }
  }

  function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    const status = statusFilter.value;
    if (status !== "All") {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    const order = sortOrder.value;
    filteredTasks.sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    if (filteredTasks.length === 0) {
      taskList.innerHTML = "<p style='color:#94a3b8;'>No tasks found.</p>";
      updateProgress();
      return;
    }

    filteredTasks.forEach(task => {
      const taskCard = document.createElement("div");
      taskCard.classList.add("task");

      const deadlineDate = new Date(task.deadline);
      const now = new Date();

      taskCard.classList.remove("completed", "in-progress", "not-started", "overdue");

      if (task.status === "Completed") {
        taskCard.classList.add("completed");
      } else if (task.status === "In Progress") {
        taskCard.classList.add("in-progress");
      } else {
        taskCard.classList.add("not-started");
      }

      if (deadlineDate < now && task.status !== "Completed") {
        taskCard.classList.add("overdue");
      }

      taskCard.innerHTML = `
        <h3>${task.title}</h3>
        <p><strong>Deadline:</strong> ${deadlineDate.toLocaleString()}</p>
        ${task.description ? `<p>${task.description}</p>` : ""}
        <div class="status">
          <span class="status-badge">${task.status}</span>
          <div class="actions">
            <button onclick="updateStatus(${task.id}, 'In Progress')">Start</button>
            <button onclick="updateStatus(${task.id}, 'Completed')">Complete</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
          </div>
        </div>
      `;

      taskList.appendChild(taskCard);
    });

    updateProgress();
    saveTasksToStorage();
  }

  function updateProgress() {
    if (tasks.length === 0) {
      progressBarInner.style.width = "0%";
      progressText.textContent = "0% Completed";
      return;
    }

    const completed = tasks.filter(task => task.status === "Completed").length;
    const percent = Math.round((completed / tasks.length) * 100);

    progressBarInner.style.width = `${percent}%`;
    progressText.textContent = `${percent}% Completed`;
  }

  function saveTasksToStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    }
  }

  loadTasksFromStorage();
  renderTasks();

  window.updateStatus = updateStatus;
  window.deleteTask = deleteTask;
});
