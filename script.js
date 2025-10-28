// DOM Selectors
const openTaskFormBtn = document.getElementById('plus-icon');
const closeTaskFormBtn = document.getElementById('x-mark');
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const descriptionInput = document.getElementById('description');
const tasksContainer = document.getElementById('tasks-container');
const formBtn = document.getElementById('form-btn');
const confirmCloseDialog = document.getElementById('confirm-close-dialog');
const cancelBtn = document.getElementById('cancel-btn');
const discardBtn = document.getElementById('discard-btn');

// Data Initialization
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

// Utility: Remove special characters and extra spaces
const removeSpecialChars = (val) =>
  val.trim().replace(/[^A-Za-z0-9\-\s]/g, '');

// Add or update a task
const addOrUpdateTask = () => {
  if (!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }

  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${removeSpecialChars(titleInput.value)
      .toLowerCase()
      .split(" ")
      .join("-")}-${Date.now()}`,
    title: removeSpecialChars(titleInput.value),
    date: dateInput.value,
    description: removeSpecialChars(descriptionInput.value),
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  resetForm();
};

// Update the tasks container in the DOM
const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
      <div class="task-container" id="${id}">
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p id="description-text"><strong>Description:</strong> ${description}</p>
        <svg id="svg-edit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="editTask('${id}')">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        <svg id="svg-delete" xmlns="http://www.w3.org/2000/svg" fill="none" 
             viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
             onclick="deleteTask('${id}')">
          <path stroke-linecap="round" stroke-linejoin="round" 
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
        </svg>
      </div>`;
  });
};

// Edit a task
const editTask = (taskId) => {
  const task = taskData.find((item) => item.id === taskId);
  if (!task) return;

  currentTask = task;
  titleInput.value = task.title;
  dateInput.value = task.date;
  descriptionInput.value = task.description;

  formBtn.innerText = 'Update Task';
  taskForm.classList.remove("hidden");
  tasksContainer.classList.add("hidden");
  openTaskFormBtn.classList.add("hidden")
  closeTaskFormBtn.classList.remove("hidden")
};

// Delete a task
const deleteTask = (taskId) => {
  const index = taskData.findIndex((item) => item.id === taskId);
  if (index > -1) {
    taskData.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(taskData));
    updateTaskContainer();
  }
};

// Reset the task form and UI states
const resetForm = () => {
  formBtn.innerText = "Add Task";
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.add("hidden");
  tasksContainer.classList.remove("hidden");
  currentTask = {};
  openTaskFormBtn.classList.remove("hidden");
};

// Initial load of tasks
if (taskData.length) {
  updateTaskContainer();
}

// Event Listeners
openTaskFormBtn.addEventListener("click", () => {
  taskForm.classList.remove("hidden");
  openTaskFormBtn.classList.add("hidden");
  closeTaskFormBtn.classList.remove("hidden");
  tasksContainer.classList.add("hidden");
});

closeTaskFormBtn.addEventListener("click", () => {
  const hasInput = titleInput.value || dateInput.value || descriptionInput.value;
  const hasChanged =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.date ||
    descriptionInput.value !== currentTask.description;

  if (hasInput && hasChanged) {
    confirmCloseDialog.showModal();
  } else {
    resetForm();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  resetForm();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateTask();
});

