export const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const getCurrentDateFormat = () => {
    const date = new Date()
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
}