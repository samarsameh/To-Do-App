/*
    tasks:
    - [x] Clear all completed tasks from the list
    - [x] Search for tasks in the list
    - [x] Filter tasks by priority (e.g., high, medium, low)

    - Save user name
    - add hover effect
    - edit size of cards and num of todos
    - add drag feature
    - sort todos by priority

    - responsive design
*/
let todosArr = [];
const form = document.getElementById("todo-form");
const taskName = document.querySelector(".todo-input.name");
const taskDescription = document.querySelector(".todo-input.description");
const taskImage = document.getElementById("imageInput");

window.addEventListener("load", () => {
  todosArr = JSON.parse(localStorage.getItem("todosArr")) || [];

  displayTask();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todo = {
    name: taskName.value,
    description: taskDescription.value,
    image: taskImage.files[0] ? URL.createObjectURL(taskImage.files[0]) : null,
    priority: document.querySelector('input[name="priority"]:checked')?.value || "low",
    done: false,
  };

  todosArr.push(todo);
  localStorage.setItem("todosArr", JSON.stringify(todosArr));

  form.reset();
  displayTask();
});

function displayTask() {
  const todos = document.querySelector(".todos");
  todos.innerHTML = "";

  const numTodo = document.getElementById("numTodo");
  numTodo.innerText = todosArr.length;

  todosArr.forEach((todo) => {
    const newTodo = document.createElement("div");
    newTodo.classList.add("todo");
    newTodo.draggable = true;

    const newImage = document.createElement("img");
    newImage.src = todo.image || "https://via.placeholder.com/150";
    newImage.alt = "Task image";
    newTodo.appendChild(newImage);

    const todoContent = document.createElement("div");
    todoContent.classList.add("todo-content");

    const todoHeader = document.createElement("div");
    todoHeader.classList.add("todo-header");
    const todoName = document.createElement("p");
    todoName.innerText = todo.name;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    newTodo.classList.toggle("done", todo.done);
    checkbox.checked = todo.done;

    const todoDescription = document.createElement("p");
    todoDescription.innerText = todo.description;

    const todoFooter = document.createElement("div");
    todoFooter.classList.add("todo-footer");

    const priority = document.createElement("span");
    priority.innerText = todo.priority;
    if(todo.priority === "low") {
        priority.classList.add("low");
    } else if(todo.priority === "Medium") {
        priority.classList.add("medium");
    } else if(todo.priority === "Hard") {
        priority.classList.add("hard");
    }

    const todoActions = document.createElement("div");
    todoActions.classList.add("todo-actions");

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

    todoHeader.appendChild(todoName);
    todoHeader.appendChild(checkbox);

    todoContent.appendChild(todoHeader);
    todoContent.appendChild(todoDescription);

    todoActions.appendChild(editButton);
    todoActions.appendChild(deleteButton);

    todoFooter.appendChild(priority);
    todoFooter.appendChild(todoActions);

    todoContent.appendChild(todoFooter);
    newTodo.appendChild(todoContent);

    todos.appendChild(newTodo);

    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      newTodo.classList.toggle("done", todo.done);
      localStorage.setItem("todosArr", JSON.stringify(todosArr));
      displayTask();
    });
    deleteButton.addEventListener("click", () => {
      todosArr = todosArr.filter((t) => t !== todo);
      localStorage.setItem("todosArr", JSON.stringify(todosArr));
      displayTask();
    });

    editButton.addEventListener("click", () => {
      taskName.value = todo.name;
      taskDescription.value = todo.description;
      document.querySelector(`input[name="priority"][value="${todo.priority}"]`).checked = true;
      if (todo.image) {
        taskImage.files = new DataTransfer().files;
        const file = new File([todo.image], "image.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        taskImage.files = dataTransfer.files; 
      }

      todosArr = todosArr.filter((t) => t !== todo);
      localStorage.setItem("todosArr", JSON.stringify(todosArr));
      displayTask();
      });
    
  });
}