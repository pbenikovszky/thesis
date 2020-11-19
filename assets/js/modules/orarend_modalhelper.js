// module to handle tables on the page

export const orarendModalHelper = (function () {
    let modal, oktatok

    let target, kartya, targy

    let numIdotartam, cbxOktatok
    let btnMegse, btnMentes

    const showModalToAdd = (data) => {
        if (!modal) return

        const targyNev = modal.querySelector('#modal-targynev')
        const targyKod = modal.querySelector('#modal-targykod')
        targy = data.targy
        targyNev.innerHTML = targy.nev
        targyKod.innerHTML = `${targy.targykod} - ${targy.tipus}`

        target = data.target
        kartya = data.kartya

        modal.classList.remove('ishidden')
    }

    const hideModal = () => {
        if (modal) {
            modal.classList.add('ishidden')
        }
    }

    const addButtonEventHandler = () => {
        btnMentes.addEventListener('click', () => {
            // kartya.style.height = `${100 * numIdotartam.value}px`
            // target.appendChild(kartya)
            const event = new CustomEvent('orahozzaadva', {
                detail: {
                    target: target,
                    kartya: kartya,
                    targy: targy,
                    hossz: numIdotartam.value,
                    oktato: cbxOktatok.value,
                },
            })
            hideModal()
            modal.dispatchEvent(event)
        })

        btnMegse.addEventListener('click', () => {
            hideModal()
        })
    }

    const init = (initData) => {
        modal = initData.modal
        oktatok = initData.oktatok || []

        numIdotartam = modal.querySelector('#num-idotartam')
        cbxOktatok = modal.querySelector('#cbx-oktatok')

        oktatok.forEach((oktato) => {
            cbxOktatok.innerHTML += `<option value="${oktato.id}">${oktato.nev}</option>`
        })

        btnMentes = modal.querySelector('#btn-mentes')
        btnMegse = modal.querySelector('#btn-megse')
        addButtonEventHandler()
    }

    // Return the public methods and properties
    return {
        showModalToAdd: showModalToAdd,
        hideModal: hideModal,
        init: init,
    }
})()
