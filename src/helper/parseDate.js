export default (date = Date) => {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    const dt = date.getDate()

    return year + '-' + month + '-' + dt
}
