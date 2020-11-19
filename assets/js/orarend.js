import { dataRepo as Repo } from './modules/dataRepo.js'
import { orarendhelper as Orarend } from './modules/orarendhelper.js'
import { orarendModalHelper as Modal } from './modules/orarend_modalhelper.js'
import { dateHelper as DateHelper } from './modules/datehelper.js'
;(function init() {
    let draggables

    const dragTargets = document.querySelectorAll('.dragtarget')
    const orarendModal = document.querySelector('#oraszerkeszto-modal')
    const idovanalDatumok = document.querySelectorAll('.idovonal__datum')

    const btnKovetkezoHet = document.querySelector('#btn-kovetkezohet')
    const btnElozoHet = document.querySelector('#btn-elozohet')

    const targyKartyaContainer = document.querySelector(
        '.orarend__targyak .targyak__lista',
    )

    const txtFilter = document.querySelector('#txt-filter')
    const cbxSzakokFilter = document.querySelector('#cbx-filterszak')

    let targyak = [],
        filteredTargyak = [],
        lathatoTargyak = [],
        oktatok = [],
        szakok = [],
        termek = [],
        orak = []

    let datumStrings = []

    /* LOAD PAGE DATA */

    const initPage = async () => {
        targyak = await Repo.getTargyak()
        oktatok = await Repo.getTanarok()
        szakok = await Repo.getSzakok()
        orak = await Repo.getOrarend()

        orak.forEach((ora) => {
            ora.targy = targyak.filter((targy) => targy.id == ora.targy_id)[0]
        })

        console.log(orak)

        Orarend.init({
            orak: orak,
            orarendTable: document.querySelector(
                '.orarend__idovonal table tbody',
            ),
        })

        targyak.sort(Orarend.compareTargyak)
        filteredTargyak = targyak
        lathatoTargyak = targyak
        oktatok.sort(Orarend.compareOktatok)
        szakok.sort(Orarend.compareSzakok)

        Modal.init({
            modal: orarendModal,
            oktatok: oktatok,
        })

        DateHelper.init()

        populateIdovonalDatumok(DateHelper.getCurrentDays())

        populateTargylista()

        populateSzakFilterCombobox()

        Orarend.populateOrarend(datumStrings)
    }

    const populateTargylista = () => {
        targyKartyaContainer.innerHTML = ''
        filteredTargyak.forEach((targy) => {
            const newTargyKartya = Orarend.getTargyKartya(targy)
            targyKartyaContainer.appendChild(newTargyKartya)
        })
        setupDragFunctions()
    }

    initPage()

    const populateIdovonalDatumok = (datumok) => {
        datumStrings = []
        for (let i = 0; i < 3; i++) {
            idovanalDatumok.item(i).innerHTML = datumok[i]
            datumStrings.push(DateHelper.getDatumString(i + 1))
        }
    }

    const populateSzakFilterCombobox = () => {
        cbxSzakokFilter.innerHTML += `<option value="0">Összes szak</option>`
        szakok.forEach((szak) => {
            cbxSzakokFilter.innerHTML += `<option value="${szak.id}">${szak.megnevezes}</option>`
        })
    }

    // Event Listener a hétváltó gombokhoz

    btnElozoHet.addEventListener('click', () => {
        populateIdovonalDatumok(DateHelper.getElozoHet())
        Orarend.populateOrarend(datumStrings)
    })

    btnKovetkezoHet.addEventListener('click', () => {
        populateIdovonalDatumok(DateHelper.getKovetkezoHet())
        Orarend.populateOrarend(datumStrings)
    })

    orarendModal.addEventListener('orahozzaadva', (e) => {
        const target = e.detail.target
        // const kartya = e.detail.kartya
        const hossz = e.detail.hossz - 0

        const nap =
            datumStrings[
                Array.from(target.parentElement.children).indexOf(target) - 1
            ]
        const oraKezdes =
            Array.from(target.parentElement.parentElement.children).indexOf(
                target.parentElement,
            ) /
                2 +
            8
        const oraVege = oraKezdes + hossz

        const ujOra = {
            id: 1,
            targy_id: e.detail.targy.id,
            targy: e.detail.targy,
            datum: nap,
            kezdes: oraKezdes,
            vege: oraVege,
            terem_id: 1,
            oktato_id: e.detail.oktato - 0,
        }

        console.log(ujOra)

        if (Orarend.hozzaadOra(ujOra)) {
            const kartya = Orarend.getOraKartya(ujOra)
            kartya.style.height = `${100 * hossz}px`
            target.appendChild(kartya)
        }
    })

    // Event listener for filterekhez

    const setFilteredTargyak = () => {
        filteredTargyak = targyak.filter((targy) => {
            return targy.nev
                .toLowerCase()
                .includes(txtFilter.value.toLowerCase())
        })
        if (cbxSzakokFilter.value != 0) {
            filteredTargyak = filteredTargyak.filter((targy) => {
                return targy.szak == cbxSzakokFilter.value
            })
        }
        populateTargylista()
    }

    txtFilter.addEventListener('keyup', setFilteredTargyak)
    cbxSzakokFilter.addEventListener('change', setFilteredTargyak)

    /* Drag functions */

    function setupDragFunctions() {
        draggables = document.querySelectorAll('.draggable')

        draggables.forEach((draggable) => {
            draggable.addEventListener('dragstart', (e) => {
                setTimeout(function () {
                    draggable.classList.add('dragging')
                }, 0)
            })

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging')
            })
        })

        dragTargets.forEach((target) => {
            target.addEventListener('dragenter', function (e) {
                e.preventDefault()
            })

            target.addEventListener('dragover', (e) => {
                e.preventDefault()
                target.classList.add('dragover')
                return false
            })

            target.addEventListener('dragleave', function () {
                target.classList.remove('dragover')
                return false
            })

            target.addEventListener('drop', () => {
                target.classList.remove('dragover')
                const mozgatottOra = document.querySelector('.dragging')

                const targy = targyak.filter(
                    (targy) => targy.id == mozgatottOra.dataset.targyid,
                )[0]

                Modal.showModalToAdd({
                    targy: targy,
                    target: target,
                    // kartya: mozgatottOra,
                })
            })
        })
    }
})()
