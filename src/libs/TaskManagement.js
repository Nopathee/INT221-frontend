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

    getTasks() {
        return this.tasks
    }
}

export { TaskManagement }