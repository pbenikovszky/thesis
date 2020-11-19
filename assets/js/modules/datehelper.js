// module to handle tables on the page

export const dateHelper = (function () {
    let currentDate

    const honapok = [
        'Január',
        'Február',
        'Március',
        'Április',
        'Május',
        'Június',
        'Július',
        'Augusztus',
        'Szeptember',
        'Október',
        'November',
        'December',
    ]

    const getCurrentDays = () => {
        const dates = []
        const csutortok = new Date(currentDate)
        const pentek = new Date(currentDate)
        const szombat = new Date(currentDate)

        pentek.setDate(csutortok.getDate() + 1)
        szombat.setDate(csutortok.getDate() + 2)

        dates.push(csutortok)
        dates.push(pentek)
        dates.push(szombat)
        const formattedDate = dates.map((dt) => {
            return `${honapok[dt.getMonth()]} ${dt.getDate()}`
        })

        return formattedDate
    }

    const init = () => {
        currentDate = new Date()
        const nap = currentDate.getDay() === 0 ? 7 : currentDate.getDay()
        const diff = currentDate.getDate() - nap + 4
        currentDate = new Date(currentDate.setDate(diff))
    }

    const getElozoHet = () => {
        currentDate.setDate(currentDate.getDate() - 7)
        return getCurrentDays()
    }

    const getKovetkezoHet = () => {
        currentDate.setDate(currentDate.getDate() + 7)
        return getCurrentDays()
    }

    const getDatumString = (hanyadikNapAHeten = 1) => {
        const dateToString = new Date(currentDate)
        dateToString.setDate(currentDate.getDate() + (hanyadikNapAHeten - 1))

        const strYear = dateToString.getFullYear().toString()
        const strMonth =
            dateToString.getMonth() + 1 < 10
                ? `0${dateToString.getMonth() + 1}`
                : `${dateToString.getMonth() + 1}`
        const strDate =
            dateToString.getDate() < 10
                ? `0${dateToString.getDate()}`
                : `${dateToString.getDate()}`
        return `${strYear}-${strMonth}-${strDate}`
    }

    // Return the public methods and properties
    return {
        init: init,
        getCurrentDays: getCurrentDays,
        getKovetkezoHet: getKovetkezoHet,
        getElozoHet: getElozoHet,
        getDatumString: getDatumString,
    }
})()
