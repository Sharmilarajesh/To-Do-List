// Initial References
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
const totalTasksSpan = document.getElementById("total-tasks");
const deleteAllButton = document.getElementById("delete-all");
let deleteTasks, tasks;
let updateNote = "";
let count;

// Function on window load
window.onload = () => {
  updateNote = "";
  count = getTotalTasksCount();
  displayTasks();
};

// Function to Display The Tasks
const displayTasks = () => {
  // Clear the tasks
  tasksDiv.innerHTML = "";

  // Fetch All The Keys in local storage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";

    // Get all values
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = JSON.parse(value);
    checkbox.classList.add("task-checkbox");
    checkbox.addEventListener("change", (e) => {
      let parent = checkbox.parentElement;
      if (checkbox.checked) {
        updateStorage(parent.id.split("_")[0], parent.querySelector("#taskname").innerText, true);
        parent.classList.add("completed");
      } else {
        updateStorage(parent.id.split("_")[0], parent.querySelector("#taskname").innerText, false);
        parent.classList.remove("completed");
      }
      totalTasksSpan.textContent = getTotalTasksCount();
    });

    taskInnerDiv.appendChild(checkbox);
    let taskNameSpan = document.createElement("span");
    taskNameSpan.id = "taskname";
    taskNameSpan.textContent = key.split("_")[1];
    taskInnerDiv.appendChild(taskNameSpan);

    if (JSON.parse(value)) {
      taskInnerDiv.classList.add("completed");
    }

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      let parent = deleteButton.parentElement;
      removeTask(parent.id);
      parent.remove();
      totalTasksSpan.textContent = getTotalTasksCount();
    });

    taskInnerDiv.appendChild(deleteButton);
    tasksDiv.appendChild(taskInnerDiv);
  }

  totalTasksSpan.textContent = getTotalTasksCount();
};

// Remove Task from local storage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

// Add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

// Function To Add New Task
document.querySelector("#push").addEventListener("click", () => {
  if (newTaskInput.value.length == 0) {
    alert("Please Enter A Task");
  } else {
    if (updateNote == "") {
      // new task
      updateStorage(count, newTaskInput.value, false);
    } else {
      // update task
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
  }
  totalTasksSpan.textContent = getTotalTasksCount();
});

// Delete All Tasks
deleteAllButton.addEventListener("click", () => {
  localStorage.clear();
  count = 0;
  displayTasks();
  totalTasksSpan.textContent = count;
});

// Get Total Tasks Count (excluding completed tasks)
const getTotalTasksCount = () => {
  let tasks = Object.keys(localStorage);
  let totalTasks = 0;
  for (let key of tasks) {
    let value = localStorage.getItem(key);
    if (!JSON.parse(value)) {
      totalTasks += 1;
    }
  }
  return totalTasks;
};
