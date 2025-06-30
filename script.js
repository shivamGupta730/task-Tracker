// date: 30-06-2025

document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const titleInput = document.getElementById("title");
  const deadlineInput = document.getElementById("deadline");
  const descInput = document.getElementById("description");
  const taskList = document.getElementById("taskList");

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
    renderTasks(tasks);

    taskForm.reset();
  });

  function renderTasks(taskArray) {
    taskList.innerHTML = "";

    taskArray.forEach(task => {
      const taskCard = document.createElement("div");
      taskCard.classList.add("task");

      const deadlineDate = new Date(task.deadline);
      const now = new Date();
      if (deadlineDate < now && task.status !== "Completed") {
        taskCard.classList.add("overdue");
      }

      taskCard.innerHTML = `
        <h3>${task.title}</h3>
        <p><strong>Deadline:</strong> ${deadlineDate.toLocaleString()}</p>
        ${task.description ? `<p>${task.description}</p>` : ""}
        <div class="status">
          <span class="status-badge">${task.status}</span>
        </div>
      `;

      taskList.appendChild(taskCard);
    });
  }
});
