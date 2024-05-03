class TaskManagement {
  constructor(previousTask = []) {
    this.tasks = previousTask
  }

  addDtoTasks(newTasks) {
    newTasks.forEach((newTask) =>
      this.addDtoTask(
        newTask.id,
        newTask.title,
        newTask.assignees,
        newTask.status
      )
    )
  }

  addDtoTask(id, title, assignees, status) {
    this.tasks.push({
      id: id,
      title: title,
      assignees: assignees,
      status: status,
    })
  }

  addTasks(newTasks) {
    newTasks.forEach((newTask) =>
      this.addTask(
        newTask.id,
        newTask.title,
        newTask.description,
        newTask.assignees,
        newTask.status,
        newTask.createdOn,
        newTask.updatedOn
      )
    )
  }

  addTask(id, title, description, assignees, status, createdOn, updatedOn) {
    this.tasks.push({
      id: id,
      title: title,
      description: description,
      assignees: assignees,
      status: status,
      createdOn: createdOn,
      updatedOn: updatedOn,
    })
  }

  addNewTask(id,title, description, assignees, status) {
    this.tasks.push({
      id: id,
      title: title,
      description: description,
      assignees: assignees,
      status: status,
    })
  }

  removeTask(removeId) {
    this.tasks.splice(
      this.tasks.findIndex((task) => task.id === removeId),
      1
    )
  }

  getTasks() {
    return this.tasks
  }
}

export { TaskManagement }
