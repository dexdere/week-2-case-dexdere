const nameInput = document.querySelector(".input-name");
const todoInput = document.querySelector(".input-todo");
const addBtn = document.querySelector(".btn-add");
const allBtn = document.querySelector(".btn-all");
const activeBtn = document.querySelector(".btn-active");
const completedBtn = document.querySelector(".btn-completed");
const clearCopletedBtn = document.querySelector(".btn-clear-completed");
const todoList = document.querySelector(".todo-list");

let todoListItems;

getMockAPI();

nameInput.value = localStorage.getItem("userName");
nameInput.addEventListener("input", userName);

function userName() {
  localStorage.setItem("userName", nameInput.value);
}


function addDomTodo(content, id) {
  const li = document.createElement("li");
  const input = document.createElement("input");
  const completedButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  input.classList.add(`todo-${id}`);
  input.value = content;
  completedButton.innerHTML = "✓";
  deleteButton.innerHTML = "X";

  completedButton.onclick = () => {
    todoListItems.map((data) => {
      if (data.content === input.value) {
        data.isCompleted = !data.isCompleted;
        input.setAttribute("isCompleted", `${data.isCompleted}`);
        putMockAPI(data.id, data.isCompleted);
      }
    });
    checkIsCompleted();
  };

  
async function getMockAPI() {
  fetch("https://61c4e388f1af4a0017d9984f.mockapi.io/todos/")
    .then((response) => response.json())
    .then((data) => (todoListItems = data))
    .then(() => todoListItems.map((data) => addDomTodo(data.content, data.id)))
    .then(() => checkIsCompleted());
}

async function postMockAPI(content) {
  fetch("https://61c4e388f1af4a0017d9984f.mockapi.io/todos/", {
    method: "POST",
    body: JSON.stringify({ content: content }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
}

async function putMockAPI(id, isCompleted, content) {
  fetch(`https://61c4e388f1af4a0017d9984f.mockapi.io/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      content: content,
      isCompleted: isCompleted,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
}

async function deleteMockAPI(id) {
  fetch(`https://61c4e388f1af4a0017d9984f.mockapi.io/todos/${id}`, {
    method: "DELETE",
  });
}
