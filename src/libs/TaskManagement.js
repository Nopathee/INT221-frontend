class TaskManagement {
    constructor(previousTask = []) {
        this.tasks = previousTask
    }

    addDtoTasks(newTasks) {
        newTasks.forEach((newTask) =>
            this.addDtoTask(newTask.taskId, newTask.taskTitle , newTask.assignees, newTask.status)
        )
    }

    addDtoTask(taskId, taskTitle , assignees , status) {
        this.tasks.push({
            taskId: taskId,
            taskTitle: taskTitle,
            assignees: assignees,
            status: status
        })
    }

    addTasks(newTasks){
        newTasks.forEach((newTask) =>
            this.addTask(newTask.id, newTask.title, newTask.description, newTask.assignees, newTask.status, newTask.createdOn, newTask.updatedOn)
        )
    }

    addTask(id,title,description,assignees,status,createdOn,updatedOn) {
        this.tasks.push({
            id: id,
            title: title,
            description: description,
            assignees: assignees,
            status: status,
            createdOn: createdOn,
            updatedOn: updatedOn
        })
    }

    getTasks() {
        return this.tasks
    }
}

export { TaskManagement }