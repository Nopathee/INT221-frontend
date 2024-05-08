class TaskManagement {
<<<<<<< Updated upstream
    constructor(previousTask = []) {
        this.tasks = previousTask
    }
=======
  constructor(previousTask = []) {
    this.tasks = previousTask
    this.statuses = previousTask
  }
>>>>>>> Stashed changes

    addDtoTasks(newTasks) {
        newTasks.forEach((newTask) =>
            this.addDtoTask(newTask.id, newTask.title , newTask.assignees, newTask.status)
        )
    }

    addDtoTask(id, title , assignees , status) {
        this.tasks.push({
            id: id,
            title: title,
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

<<<<<<< Updated upstream
    getTasks() {
        return this.tasks
    }
=======
  addNewTask(id, title, description, assignees, status) {
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

  updateTask(id, title, description, assignees, status) {
    this.tasks = this.tasks.map((task) => {
      return task.id === id
        ? { ...task, title: title, description: description, assignees: assignees, status: status}
        : task
    })
  }

  getTasks() {
    return this.tasks
  }

  getStatus() {
    return this.statuses
  }

  addStatus(id,name,description) {
    this.statuses.push({
      id: id,
      name: name,
      description: description,
    })
  }

>>>>>>> Stashed changes
}

export { TaskManagement }