class UserInterface {
    constructor() {
        this.addTaskForm = document.querySelector('#add-task-form');
        this.addTaskInput = document.querySelector('#add-task-input');
        this.addTaskBtn = document.querySelector('#add-task-btn');
        this.taskList = document.querySelector('#task-list');
        this.taskType = document.querySelector('#task-type');
        this.editDialog = document.querySelector('#edit-dialog');
        this.closeDialogBtn = document.querySelector('#close-dialog-btn');
        this.editForm = document.querySelector('#edit-form');
        this.editText = document.querySelector('#edit-text');
        this.taskId = document.querySelector('#task-id');
        this.stopRemindersBtn = document.querySelector('#stop-reminders-btn');
        this.addRemindersBtn = document.querySelector('#add-reminders-btn');
    }
    showTask(task) {
        const newTask = document.createElement('p');
        newTask.classList.add('task-item');
        ui.taskList.appendChild(newTask);
        newTask.textContent = `
        Id: ${task.Id} Task: ${task.Name} (${task.Type})
        `;
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-task-btn');
        newTask.append(editBtn);
        editBtn.textContent = 'Edit Task';
        eventListeners.addEditEvent(editBtn, task.Id);
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-task-btn');
        newTask.append(deleteBtn);
        deleteBtn.textContent = 'Delete';
        eventListeners.addDeleteEvent(deleteBtn, task.Id);
    }
}

class Events {
    constructor() {
        this.submitNewTask = ui.addTaskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newTask = {
                Id: (task.taskItems.length + 1),
                Name: ui.addTaskInput.value,
                Type: ui.taskType.value
            }
            ui.showTask(newTask);
            task.addTask(newTask);
            ui.addTaskInput.value = '';
        });
        this.updateTask = ui.editForm.addEventListener('submit', (event) => {
            event.preventDefault();
            task.taskItems.forEach((item) => {
                if(item.Id === parseInt(ui.taskId.textContent)) {
                    item.Name = ui.editText.value;
                    ui.taskList.innerHTML = '';
                    ui.editText.value = '';
                    task.saveTasks();
                    task.getTasks();
                    ui.editDialog.close();
                }
            })
        });
        this.closeDialog = ui.closeDialogBtn.addEventListener('click', () => {
            ui.editDialog.close();
        });
        this.stopReminders = ui.stopRemindersBtn.addEventListener('click', () => {
            task.turnOffReminders = true;
        });
        this.resumeReminders = ui.addRemindersBtn.addEventListener('click', () => {
            task.turnOffReminders = false;
        });
    }
    addEditEvent(button, Id) {
        button.addEventListener('click', () => {
            task.taskItems.forEach((item) => {
                if(item.Id === Id) {
                    ui.editDialog.showModal();
                    ui.editText.value = item.Name;
                    ui.taskId.textContent = Id;
                }
            })
        })
    }
    addDeleteEvent(button, Id) {
        button.addEventListener('click', () => {
            task.taskItems.forEach((item, index) => {
                if(item.Id === Id) {
                    task.taskItems.splice(index, 1);
                    ui.taskList.innerHTML = '';
                    task.saveTasks();
                    task.getTasks();
                }
            })
        })
    }
}

class Main {
    constructor() {
        this.taskItems = [];
        this.addPostureCheck = setInterval(() => {
            if(task.taskItems.length < 15 && this.turnOffReminders === false) {
                const reminder = {
                    Id: (task.taskItems.length + 1),
                    Name: 'Posture check, back away from the screen!',
                    Type: 'Other'
                }
                this.taskItems.push(reminder);
                this.saveTasks();
                ui.showTask(reminder);
            }
        }, 600000);
        this.turnOffReminders = false;
    }
    getTasks() {
        if(localStorage.getItem('tasks') !== null) {
            const savedTasks = JSON.parse(localStorage.getItem('tasks'))
            savedTasks.forEach((item) => {
                this.taskItems.push(item);
                ui.showTask(item)
            });
        }
    }
    addTask(task) {
        this.taskItems.push(task);
        this.saveTasks(this.taskItems);
    }
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.taskItems));
    }
}

const ui = new UserInterface();
const eventListeners = new Events();
const task = new Main();
task.getTasks();
