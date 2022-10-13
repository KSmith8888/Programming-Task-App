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
        this.editType = document.querySelector('#edit-task-type');
        this.taskId = document.querySelector('#task-id');
        this.reminderText = document.querySelector('#reminder-text');
        this.reminderType = document.querySelector('#reminder-task-type');
        this.stopRemindersBtn = document.querySelector('#stop-reminders-btn');
        this.remindersForm = document.querySelector('#automatic-reminder-form');
        this.reminderInterval = document.querySelector('#reminder-interval');
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
        events.addEditEvent(editBtn, task.Id);
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-task-btn');
        newTask.append(deleteBtn);
        deleteBtn.textContent = 'Delete';
        events.addDeleteEvent(deleteBtn, task.Id);
    }
}

class EventListeners {
    constructor() {
        this.submitNewTask = ui.addTaskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newTask = {
                Id: (task.idValue),
                Name: ui.addTaskInput.value,
                Type: ui.taskType.value
            }
            task.idValue++;
            task.saveIdValue();
            ui.showTask(newTask);
            task.addTask(newTask);
            ui.addTaskInput.value = '';
        });
        this.updateTask = ui.editForm.addEventListener('submit', (event) => {
            event.preventDefault();
            task.taskItems.forEach((item) => {
                if(item.Id === parseInt(ui.taskId.textContent)) {
                    item.Name = ui.editText.value;
                    item.Type = ui.editType.value;
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
            reminder.turnOffReminders = true;
        });
        this.submitReminderForm = ui.remindersForm.addEventListener('submit', (event) => {
            event.preventDefault();
            reminder.createNewReminder(ui.reminderText.value, ui.reminderType.value, ui.reminderInterval.value);
            ui.reminderText.value = '';
            ui.reminderInterval.value = '';
            ui.reminderType.value = 'Other';
        });
    }
    addEditEvent(button, Id) {
        button.addEventListener('click', () => {
            this.openEditDialog();
            task.taskItems.forEach((item) => {
                if(item.Id === Id) {
                    
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
    openEditDialog() {
        ui.editDialog.showModal();
    }
}

class AutomaticReminders {
    constructor() {
        this.savedReminders = localStorage.getItem('reminders') || [];
        this.turnOffReminders = false;
    }
    createNewReminder(name, type, interval) {
        const adjustedInterval = interval * 1000;
        this.newReminder = setInterval(() => {
            if(task.taskItems.length < 15 && this.turnOffReminders === false) {
                const reminder = {
                    Id: parseInt(task.idValue),
                    Name: name,
                    Type: type
                }
                task.idValue = parseInt(task.idValue) + 1;
                task.saveIdValue();
                ui.showTask(reminder);
            }
        }, adjustedInterval);
    }
}

class Main {
    constructor() {
        this.taskItems = [];
        this.idValue = localStorage.getItem('idValue') || 1;
    }
    getTasks() {
        if(localStorage.getItem('tasks') !== null) {
            this.taskItems = [];
            const savedTasks = JSON.parse(localStorage.getItem('tasks'))
            savedTasks.forEach((item) => {
                this.taskItems.push(item);
                ui.showTask(item);
            });
        }
    }
    addTask(task) {
        this.taskItems.push(task);
        this.saveTasks();
    }
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.taskItems));
    }
    saveIdValue() {
        localStorage.setItem('idValue', JSON.stringify(this.idValue));
    }
}

const ui = new UserInterface();
const events = new EventListeners();
const task = new Main();
const reminder = new AutomaticReminders();
task.getTasks();
