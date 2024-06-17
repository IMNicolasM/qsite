interface Status {
    label: string,
    icon: {
        name: string,
        color: string,
    }
}

export interface ActionsStatus {
    1: Status,
    2: Status,
    3: Status,
    4: Status,
}