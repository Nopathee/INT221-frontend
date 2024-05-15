class StatusManagement {
  constructor(previousStatus = []) {
    this.statuses = previousStatus
  }

  addStatuses(newStatuses) {
    newStatuses.forEach((newStatus) =>
      this.addStatus(newStatus.id, newStatus.name, newStatus.description, newStatus.createdOn, newStatus.updatedOn)
    )
  }

  addStatus(id, name, description,createdOn , updatedOn) {
    this.statuses.push({
      id: id,
      name: name,
      description: description,
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
    return this.statuses
  }

  
}

export { StatusManagement}
