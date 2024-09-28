class StatusManagement {
  constructor(previousStatus = []) {
    this.statuses = previousStatus
  }

  addStatuses(newStatuses) {
    newStatuses.forEach((newStatus) =>
      this.addStatus(newStatus.id, newStatus.name, newStatus.description,newStatus.color, newStatus.createdOn, newStatus.updatedOn)
    )
  }

  addStatus(id, name, description,color,createdOn , updatedOn) {
    this.statuses.push({
      id: id,
      name: name,
      description: description,
      color: color,
      createdOn: createdOn,
      updatedOn: updatedOn,
    })
  }

  removeStatus(removeId) {
    this.statuses.splice(
      this.statuses.findIndex((status) => status.id === removeId),
      1
    )
  }

  updateStatus(id,name, description, ) {
    this.statuses = this.statuses.map((status) => {
      return status.id === id
        ? {
            ...status,
            name: name,
            description: description,
          }
        : status
    })
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

  
}

export { StatusManagement}
