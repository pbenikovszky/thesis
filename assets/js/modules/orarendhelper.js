// module to handle tables on the page

export const orarendhelper = (function () {
    let orarend = []
    let orarendTable = undefined

    const init = (data) => {
        orarend = data.orak
        orarendTable = data.orarendTable
    }

    const getTargyKartya = (targy) => {
        const kartyaDiv = document.createElement('div')
        kartyaDiv.classList.add('targy__kartya')
        kartyaDiv.classList.add('draggable')
        kartyaDiv.dataset.targyid = targy.id

        const nevDiv = document.createElement('div')
        nevDiv.classList.add('targy__nev')
        nevDiv.innerHTML = targy.nev

        const targykodDiv = document.createElement('div')
        targykodDiv.classList.add('targy__kod')
        targykodDiv.innerHTML = `${targy.targykod} - ${targy.tipus}`

        kartyaDiv.appendChild(nevDiv)
        kartyaDiv.appendChild(targykodDiv)

        kartyaDiv.draggable = true

        return kartyaDiv
    }

    const getOraKartya = (ora) => {
        const mainDiv = getTargyKartya(ora.targy)
        mainDiv.classList.add('ora__kartya')
        mainDiv.classList.remove('targy__kartya')

        const tanarDiv = document.createElement('div')
        tanarDiv.innerHTML = `Oktató: ${ora.oktato_id}`

        mainDiv.appendChild(tanarDiv)

        mainDiv.style.height = `${100 * (ora.vege - ora.kezdes)}px`
        mainDiv.draggable = false
        return mainDiv
    }

    const hozzaadOra = (ujOra) => {
        // Ütközési feltételek vizsgálata

        // Az óra "kilóg az órarendből" - vagyis este 8 után ér véget
        if (ujOra.vege > 20) {
            alert('Az óra nem tarthat este 8 óránál tovább!')
            return false
        }

        // Ütközik más órával a teremben
        // Kivétel: ha egy tárgycsoportban vannak
        const orakAzonosNaponTeremben = orarend.filter((ora) => {
            return ora.datum == ujOra.datum && ora.terem_id == ujOra.terem_id
        })

        for (const ora of orakAzonosNaponTeremben) {
            if (
                (ujOra.kezdes >= ora.kezdes && ujOra.kezdes < ora.vege) ||
                (ujOra.vege > ora.kezdes && ujOra.vege <= ora.vege) ||
                (ujOra.kezdes < ora.kezdes && ujOra.vege > ora.vege)
            ) {
                alert(
                    `Ütközés a következő órával:\n${ora.targy.nev}\n${ora.datum} ${ora.kezdes}-${ora.vege}`,
                )
                return false
            }
        }
        // Ütközik az évfolyam egy másik órájával

        // Ütközik a tanár egy másik órájával
        orarend.push(ujOra)
        return true
    }

    const compareTargyak = (a, b) => a.nev.localeCompare(b.nev)

    const compareSzakok = (a, b) => a.megnevezes.localeCompare(b.megnevezes)

    const populateOrarend = (napok) => {
        Array.from(orarendTable.querySelectorAll('tr')).forEach((row) => {
            Array.from(row.querySelectorAll('td:not(:first-of-type)')).forEach(
                (column) => {
                    column.innerHTML = ''
                },
            )
        })

        const orakAdottHeten = orarend.filter((ora) => {
            return napok.includes(ora.datum)
        })

        orakAdottHeten.forEach((ora) => {
            const ujOraKartya = getOraKartya(ora)
            const oszlop = napok.indexOf(ora.datum)
            const sor = (ora.kezdes - 8) * 2
            orarendTable.children[sor].children[oszlop + 1].appendChild(
                ujOraKartya,
            )
        })
    }

    // Return the public methods and properties
    return {
        init: init,
        getTargyKartya: getTargyKartya,
        getOraKartya: getOraKartya,
        compareTargyak: compareTargyak,
        compareOktatok: compareTargyak,
        compareSzakok: compareSzakok,
        hozzaadOra: hozzaadOra,
        populateOrarend: populateOrarend,
    }
})()
