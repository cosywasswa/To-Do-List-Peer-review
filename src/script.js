import './style.css';
import { clearCompletedItems, handleCheckboxClick } from './modules/interactive.js';

class TaskManager {
  constructor() {
    this.myTasks = [];
    this.container = document.getElementById('list-items');
    this.myTaskInput = document.getElementById('addtask');
    this.clearButton = document.querySelector('.clear');

    this.initialize();
    this.loadTasksFromLocalStorage();
  }

  initialize() {
    this.myTaskInput.addEventListener('keypress',
      this.getInput.bind(this));
    this.clearButton.addEventListener('click',
      this.clearCompletedItems.bind(this));

    this.container.addEventListener('click', (event) => {
      const kebabMenu = event.target.closest('.kebab-menu');
      if (kebabMenu) {
        kebabMenu.classList.toggle('active');
        const deleteIcon = kebabMenu.querySelector('.delete');
        if (deleteIcon) {
          deleteIcon.classList.toggle('active');
        }
      }
    });

    this.container.addEventListener('click', (event) => {
      const deleteIcon = event.target.closest('.delete');
      if (deleteIcon) {
        event.stopPropagation();
        const listItem = deleteIcon.closest('.list');
        const index = Array.from(this.container.children).indexOf(listItem);
        this.deleteListItem(index);
      }
    });

    this.container.addEventListener('click', (event) => {
      const checkbox = event.target.closest('.check');
      if (checkbox) {
        handleCheckboxClick(event, this.container,
          this.myTasks, this.updateCompleted.bind(this),
          this.storeItems.bind(this));
      }
    });
  }

  loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('myTasks');
    if (storedTasks) {
      this.myTasks = JSON.parse(storedTasks);
      this.myTasks.forEach((task, index) => {
        this.displayTask(index);
      });
    }
  }

  addTaskToArray(description, completed, index) {
    this.myTasks.push({
      description,
      completed: false,
      index,
    });
  }

  getInput(event) {
    if (event.key === 'Enter') {
      const description = this.myTaskInput.value.trim();

      if (description !== '') {
        this.addTaskToArray(description, false,
          this.myTasks.length + 1);
        this.myTaskInput.value = '';
        this.displayTask(this.myTasks.length - 1);
        this.storeItems();
      }
    }
  }

  displayTask(index) {
    const item = document.createElement('li');
    const checkbox = document.createElement('input');
    const taskDescription = document.createElement('input');
    const element = document.createElement('hr');
    const kebabMenu = document.createElement('div');
    const kebabIcon = document.createElement('span');
    const trash = document.createElement('span');

    trash.classList.add('fas', 'fa-trash', 'delete');
    checkbox.type = 'checkbox';
    checkbox.classList.add('check');
    item.classList.add('list');
    taskDescription.value = this.myTasks[index].description;
    taskDescription.classList.add('disc');
    kebabMenu.classList.add('kebab-menu');
    kebabIcon.classList.add('kebab-icon');
    kebabIcon.innerHTML = '&#8942;';
    kebabMenu.appendChild(kebabIcon);

    item.appendChild(checkbox);
    item.appendChild(taskDescription);
    item.appendChild(element);
    item.appendChild(kebabMenu);
    item.appendChild(trash);
    this.container.appendChild(item);

    checkbox.addEventListener('click', (event) => {
      handleCheckboxClick(event, this.container, this.myTasks,
        this.updateCompleted.bind(this),
        this.storeItems.bind(this));
    });

    if (this.myTasks[index].completed) {
      taskDescription.classList.add('completed');
      checkbox.checked = true;
    }

    taskDescription.addEventListener('change', () => {
      const newDescription = taskDescription.value.trim();
      if (newDescription !== '') {
        this.editTask(index, newDescription);
      } else {
        taskDescription.value = this.myTasks[index].description;
      }
    });
  }

  deleteListItem(index) {
    this.container.removeChild(this.container.children[index]);
    this.myTasks.splice(index, 1);
    this.updateIndexes();
    this.storeItems();
  }

  updateIndexes() {
    this.myTasks.forEach((task, index) => {
      task.index = index + 1;
    });
  }

  storeItems() {
    localStorage.setItem('myTasks', JSON.stringify(this.myTasks));
  }

  editTask(index, newDescription) {
    if (index >= 0 && index < this.myTasks.length) {
      this.myTasks[index].description = newDescription;
      this.storeItems();
    }
  }

  updateCompleted(index, isChecked) {
    if (index >= 0 && index < this.myTasks.length) {
      this.myTasks[index].completed = isChecked;
      const taskDescription = document.querySelector(`#list-items li:nth-child(${index + 1}) .disc`);
      if (isChecked) {
        taskDescription.classList.add('completed');
      } else {
        taskDescription.classList.remove('completed');
      }
      this.storeItems();
    }
  }

  clearCompletedItems() {
    clearCompletedItems(this.container, this.myTasks,
      this.updateIndexes.bind(this),
      this.storeItems.bind(this));
  }
}

const taskManager = new TaskManager();
