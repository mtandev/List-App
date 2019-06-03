// Task Class: Represents a task

class Task {
  constructor(item, assigned, deadline) {
    this.item = item;
    this.assigned = assigned;
    this.deadline = deadline;
  }
}

// UI Class: Handles UI Tasks

class UI {
  static displayTasks() {

    const tasks = Store.getTasks();

    tasks.forEach((task) => UI.addTaskToList(task));
  }

  static addTaskToList(task) {
    const list = document.querySelector('#task-list');

    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${task.item}</td>
    <td>${task.assigned}</td>
    <td>${task.deadline}</td>
    <td><a href="#" class="btn btn-success btn-sm success">Complete</a></td>
    `;

    list.appendChild(row);
  }

  static completeTask(el) {
    if(el.classList.contains('success')) {
      el.parentElement.parentElement.remove();
    }
  }

  static displayAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#list-form');
    container.insertBefore(div, form);

    // Disappear in 2 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2000);

  }

  static clearFields() {
    document.querySelector('#item').value = '';
    document.querySelector('#assigned').value = '';
    document.querySelector('#deadline').value = '';
  }
}

// Store Class: Handles Storage

class Store {
  static getTasks() {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    return tasks;
  }

  static addTask(task) {
    const tasks = Store.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

  }

  static removeTask(deadline) {
    const tasks = Store.getTasks();

    tasks.forEach((task, index) => {
      if(task.deadline === deadline) {
        tasks.splice(index, 1);
      }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Event: Display Tasks

document.addEventListener('DOMContentLoaded', UI.displayTasks);

// Event: Add Tasks
document.querySelector('#list-form').addEventListener('submit', (e) => {

  // Prevent Default action
  e.preventDefault();

  // Get Form values

  const item = document.querySelector('#item').value;
  const assigned = document.querySelector('#assigned').value;
  const deadline = document.querySelector('#deadline').value;

  // validate

  if(item === '' || assigned === '' || deadline === '' ) {
    UI.displayAlert('All fields required.', 'danger');
  } else {

    // Instantiate Task

    const task = new Task(item, assigned, deadline);

    // Add Task to UI

    UI.addTaskToList(task);

    //Add Task to Store
    Store.addTask(task);

    // Display Success message

    UI.displayAlert('Task Created', 'success');

    // Clear fields Method

    UI.clearFields();

  }
});

// Event: Complete Tasks

document.querySelector('#task-list').addEventListener('click', (e) => {

  // Remove Task from UI
UI.completeTask(e.target)

// Remove Task from Store
Store.removeTask(e.target.parentElement.previousElementSibling.textContent);

// Display Success message

UI.displayAlert('Task Completed!', 'success');
});
