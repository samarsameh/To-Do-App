let todosArr = [];
const form = document.getElementById("todo-form");
const taskName = document.querySelector(".todo-input.name");
const taskDescription = document.querySelector(".todo-input.description");
const taskImage = document.getElementById("imageInput");
const allCards = document.querySelectorAll(".card");
const userName = document.querySelector('.name-input');
const search = document.getElementById('search-label');

window.addEventListener("load", () => {
  todosArr = JSON.parse(localStorage.getItem("todosArr")) || [];
  userName.value = JSON.parse(localStorage.getItem("userName")) || "";

  displayTask();
});

userName.addEventListener('blur', () => {
  if(userName.value){
    localStorage.setItem("userName", JSON.stringify(userName.value));
  }
})

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todo = {
    id: Date.now().toString(),
    name: taskName.value,
    description: taskDescription.value,
    image: taskImage.files[0] ? URL.createObjectURL(taskImage.files[0]) : null,
    priority:
      document.querySelector('input[name="priority"]:checked')?.value || "low",
    status: "hold",
    done: false,
  };

  todosArr.push(todo);
  localStorage.setItem("todosArr", JSON.stringify(todosArr));

  form.reset();
  displayTask();
});

function displayTask(tasksToDisplay = todosArr) {
  const todos = document.querySelectorAll(".todos");
  todos.forEach((todoCol) => {
    todoCol.innerHTML = "";
  });

  tasksToDisplay.forEach((todo) => {
    const newTodo = document.createElement("div");
    newTodo.dataset.id = todo.id;
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
    if (todo.priority === "low") {
      priority.classList.add("low");
    } else if (todo.priority === "Medium") {
      priority.classList.add("medium");
    } else if (todo.priority === "Hard") {
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

    if (todo.status === "hold") {
      document.querySelector(".todos.hold")?.appendChild(newTodo);
    } else if (todo.status === "inProgress") {
      document.querySelector(".todos.inprogress")?.appendChild(newTodo);
    } else if (todo.status === "done") {
      document.querySelector(".todos.done")?.appendChild(newTodo);
    }

    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      todo.status = todo.done ? "done" : "hold";
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
      document.querySelector(
        `input[name="priority"][value="${todo.priority}"]`,
      ).checked = true;
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

    newTodo.addEventListener("dragstart", () => {
      newTodo.classList.add("dragging");
    });

    newTodo.addEventListener("dragend", () => {
      newTodo.classList.remove("dragging");
    });
  });
  cardCol ();
}

allCards.forEach((card) => {
  card.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  card.addEventListener("drop", (e) => {
    e.preventDefault();

    const curTodo = document.querySelector(".dragging");
    if (!curTodo) return;

    const todosContainer = card.querySelector(".todos");
    if (!todosContainer) return;

    todosContainer.appendChild(curTodo);

    const todoId = curTodo.dataset.id;
    const todoTarget = todosArr.find((t) => t.id === todoId);

    if (todoTarget) {
      if (todosContainer.classList.contains("hold")) {
        todoTarget.status = "hold";
      } else if (todosContainer.classList.contains("inprogress")) {
        todoTarget.status = "inProgress";
      } else if (todosContainer.classList.contains("done")) {
        todoTarget.status = "done";
        todoTarget.done = true;
      }

      if (!todosContainer.classList.contains("done")) {
        todoTarget.done = false;
      }

      localStorage.setItem("todosArr", JSON.stringify(todosArr));
      displayTask();
    }
  });
});

search.addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  console.log(value);

  const filtered = todosArr.filter(todo =>
    todo.name.toLowerCase().includes(value));
  console.log(filtered) 

  displayTask(filtered);
})

function cardCol () {
  document.querySelector(".card:has(.hold) .numTodo").innerText =
    todosArr.filter((t) => t.status === "hold").length;
  document.querySelector(".card:has(.inprogress) .numTodo").innerText =
    todosArr.filter(
      (t) => t.status === "inProgress" || t.status === "inprogress",
    ).length;
  document.querySelector(".card:has(.done) .numTodo").innerText =
    todosArr.filter((t) => t.status === "done").length;
}