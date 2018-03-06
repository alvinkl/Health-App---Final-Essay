export const responseJSON = (res, data) => {
    res.status(200)
    res.set({
        'Content-Type': 'application/json',
        Accept: 'applicaton/json',
    })

    return res.json(data)
}

export const responseError = (res, status_code, error_message) => {
    res.status(status_code)
    res.set({
        'Content-Type': 'application/json',
        Accept: 'application/json',
    })

    const err = {
        error_message,
    }

    return res.json(err)
}

export const responseTemplate = (res, template_name, data) => {
    res.status(200)
    res.set({
        'Content-Type': 'text/html',
        Accept: 'text/html',
    })

    res.render(template_name, data)
}
