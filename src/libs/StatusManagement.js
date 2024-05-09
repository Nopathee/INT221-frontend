class StatusManagement {
    constructor(previousStatus = []) {
        this.status = previousStatus
    }

    addStatuses(newStatuses) {
        newStatuses.forEach((newStatus) =>
            this.addStatus(
                newStatus.id,
                newStatus.name,
                newStatus.description
            )
        )
    }

    addStatus(id, name, description) {
        this.status.push({
            id: id,
            name: name,
            description: description
        })
    }

    getStatuses() {
        return this.status
    }
}

export { StatusManagement}
