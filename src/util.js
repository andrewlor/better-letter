export const formatDate = (date) =>
    `${date.toLocaleString('default', {
        month: 'long',
    })} ${date.getDay()}, ${date.getFullYear()}`
