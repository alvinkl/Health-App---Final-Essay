export default (element, target, duration) => {
    const scrollTo = (element, target, duration) => {
        if (duration <= 0) return

        const targetOffset = target.offsetTop - target.offsetHeight
        const difference = targetOffset - element.scrollTop
        const perTick = difference / duration * 10

        setTimeout(function() {
            element.scrollTop = element.scrollTop + perTick
            if (element.scrollTop === targetOffset) return
            scrollTo(element, target, duration - 10)
        }, 10)
    }

    scrollTo(element, target, duration)
}
