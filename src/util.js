export const formatDate = (date) =>
    `${date.toLocaleString('default', {
        month: 'long',
    })} ${date.getDate()}, ${date.getFullYear()}`

export const autofillVariableValue = (name) => {
    const lower = name.toLowerCase()
    if (lower.includes('date')) {
        return formatDate(new Date())
    }
}
