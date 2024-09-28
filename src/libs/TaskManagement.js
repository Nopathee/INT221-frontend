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
    return this.tasks.map(task => {
        switch (task.status.name) {
            case 'NO_STATUS':
                task.status.name = 'No Status';
                break;
            case 'TO_DO':
                task.status.name = 'To Do';
                break;
            case 'DOING':
                task.status.name = 'Doing';
                break;
            case 'DONE':
                task.status.name = 'Done';
                break;
            default:
                break;
        }
        return task;
    });
}

getStatuses() {
  console.log(this.statuses);

  return this.statuses.map(status => {
      switch (status.name) {
          case 'NO_STATUS':
              return { ...status, name: 'No Status' };
          case 'TO_DO':
              return { ...status, name: 'To Do' };
          case 'DOING':
              return { ...status, name: 'Doing' };
          case 'DONE':
              return { ...status, name: 'Done' };
          default:
              return status;
      }
  });
}
  addStatus(id,name,description) {
    this.statuses.push({
      id: id,
      name: name,
      description: description,
    })
  }

}

export { TaskManagement }
