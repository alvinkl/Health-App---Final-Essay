export default (date = Date) => {
    const year = date.getFullYear()

    let month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month

    let dt = date.getDate()
    dt = dt < 10 ? '0' + dt : dt

    return year + '-' + month + '-' + dt
}
