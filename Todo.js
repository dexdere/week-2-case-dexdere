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

function checkIsCompleted(param = todoListItems) {
  let todoItem = document.querySelector(".todo-list").children;
  param.map((data, index) => {
    if (data.isCompleted === true) {
      todoItem[index].children[0].setAttribute("isCompleted", "true");
    } else {
      todoItem[index].children[0].setAttribute("isCompleted", "false");
    }
  });
}

function checkArrayUndefined() {
  for (let i = 0; i < todoListItems.length; i++) {
    if (todoListItems[i] === undefined) {
      todoListItems.splice(i, 1);
      i--;
    }
  }
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

  deleteButton.onclick = () => {
    todoListItems.map((data, index) =>
      data.content === input.value ? delete todoListItems[index] : false
    );
    li.remove();
    checkArrayUndefined();
    deleteMockAPI(id);
  };

  li.appendChild(input);
  li.appendChild(completedButton);
  li.appendChild(deleteButton);
  todoList.appendChild(li);
}

addBtn.onclick = () => {
  let regex = /(?!^$)([^\s]){3,}/g;
  if (regex.test(todoInput.value)) {
    todoListItems.push({ content: todoInput.value });
    todoList.innerHTML = "<h3>Yükleniyor...</h3>";
    postMockAPI(todoInput.value);
    setTimeout(getMockAPI, 200);
    todoInput.value = "";
  }
};

completedBtn.onclick = () => {
  let completed = todoListItems.filter((data) => data.isCompleted);
  todoList.innerHTML = "";
  completed.map((data) => addDomTodo(data.content, data.id));
  checkIsCompleted(completed);
};

activeBtn.onclick = () => {
  let active = todoListItems.filter((data) => data.isCompleted === false);
  todoList.innerHTML = "";
  active.map((data) => addDomTodo(data.content, data.id));
};

const allButton = (allBtn.onclick = () => {
  todoList.innerHTML = "";
  todoListItems.map((data) => addDomTodo(data.content, data.id));
  checkIsCompleted();
});

clearCopletedBtn.onclick = () => {
  todoListItems.map((data, index) => {
    if (data.isCompleted === true) {
      deleteMockAPI(data.id);
      delete todoListItems[index];
    }
  });

  checkArrayUndefined();
  allButton();
};

async function getMockAPI() {
  await fetch("https://61c4e388f1af4a0017d9984f.mockapi.io/todos/")
    .then((response) => response.json())
    .then((data) => (todoListItems = data))
    .then(() => (todoList.innerHTML = ""))
    .then(() => todoListItems.map((data) => addDomTodo(data.content, data.id)))
    .then(() => checkIsCompleted());
}

async function postMockAPI(content, isCompleted, id) {
  fetch("https://61c4e388f1af4a0017d9984f.mockapi.io/todos/", {
    method: "POST",
    body: JSON.stringify({ content }),
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
