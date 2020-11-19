import { tableHandler as TableHandler } from './modules/tablehandler.js'
import { dataRepo as Repo } from './modules/dataRepo.js'
import { csvImportExport as CSV } from './modules/csvtools.js'
import { helper as Helper } from './modules/helper.js'
;(function init() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const page = urlParams.get('page') || 'tanarok'

    let editFormFieldsOptions = {}
    let dataRepoGetFunction
    let tableHeaderLables

    switch (page) {
        case 'tanarok':
            tableHeaderLables = ['ID', 'Név', 'Szoba', 'Email', 'Telefon']
            editFormFieldsOptions = {
                nev: { label: 'Név', type: 'text' },
                szoba: { label: 'Szoba', type: 'text' },
                email: { label: 'Email', type: 'text' },
                telefon: { label: 'Telefon', type: 'text' },
            }
            dataRepoGetFunction = Repo.getTanarok
            break

        case 'szakok':
            tableHeaderLables = ['ID', 'Megnevezés', 'Aktív-e?']
            editFormFieldsOptions = {
                megnevezes: { label: 'Megnevezés', type: 'text' },
                aktiv: { label: 'Aktvív-e?', type: 'checkbox' },
            }
            dataRepoGetFunction = Repo.getSzakok
            break

        case 'termek':
            tableHeaderLables = ['ID', 'Szám', 'Név', 'Kapacitás', 'Gépterem']
            editFormFieldsOptions = {
                number: { label: 'Teremszám', type: 'text' },
                name: { label: 'Név', type: 'text' },
                capacity: { label: 'Kapacitás', type: 'text' },
                computers: { label: 'Számítógépterem', type: 'checkbox' },
            }
            dataRepoGetFunction = Repo.getTermek
            break

        case 'targyak':
            tableHeaderLables = [
                'ID',
                'Tárgykód',
                'Név',
                'Típus',
                'Ajanlott félév',
                'Szak',
                'Aktiv',
            ]
            editFormFieldsOptions = {
                targykod: { label: 'Tárgykód', type: 'text' },
                nev: { label: 'Név', type: 'text' },
                tipus: { label: 'Típus', type: 'text' },
                ajanlott_felev: { label: 'Ajánlott félév', type: 'text' },
                szak: { label: 'Szak', type: 'text' },
                aktiv: { label: 'Aktív', type: 'checkbox' },
            }
            dataRepoGetFunction = Repo.getTargyak
            break

        default:
            console.log('Invalid page')
    }

    const loader = document.querySelector('#loader')
    const mainContent = document.querySelector('#main-content')

    const csvImportModal = document.querySelector('#csv-import-modal')
    const modalCloseBtn = csvImportModal.querySelector('.close')
    const uploadedFileInput = csvImportModal.querySelector('#uploaded-file')
    const uploadedFileName = csvImportModal.querySelector('.selected-filename')
    const btnUploadFile = csvImportModal.querySelector('#btn-upload-file')
    const uploadDropzone = csvImportModal.querySelector('#dropzone')

    const btnExport = document.querySelector('#btn-export')
    const btnImport = document.querySelector('#btn-import')

    let btnSave
    let fileToUpload
    let tableItems

    initPage()

    async function initPage() {
        tableItems = await dataRepoGetFunction()
        TableHandler.init({
            table: document.querySelector('#list-table'),
            tableHeaderLabels: tableHeaderLables,
            items: tableItems,
            editForm: document.querySelector('#listpage-editform'),
            editFormFields: editFormFieldsOptions,
        })

        loader.classList.add('ishidden')
        mainContent.classList.remove('ishidden')

        btnSave = document.querySelector(
            '#listpage-editform input[type="submit"]',
        )

        btnSave.addEventListener('click', onSaveClick)
    }

    const updateImportModal = () => {
        uploadedFileName.innerHTML = fileToUpload.name
        btnUploadFile.classList.remove('disabled')
    }

    const resetImportModal = () => {
        uploadedFileInput.value = null
        uploadedFileName.innerHTML = 'Még nem választott fájlt.'
        btnUploadFile.classList.add('disabled')
    }

    // button click handlers

    const onSaveClick = (e) => {
        e.preventDefault()

        const formValidity = TableHandler.validateEditForm()
        if (!formValidity.valid) return

        const originalData = TableHandler.getSelectedItem()
        const dataToSave = TableHandler.getEditFormValues()

        if (Helper.isEqual(originalData, dataToSave)) {
            console.log('Egyforma ez bástya')
            return
        }

        console.log('Mehet a mentés')
    }

    btnExport.addEventListener('click', function onExportClick() {
        // const csvString = CSV.convertTableToCSV({
        //     table: document.querySelector('#list-table'),
        //     includeHeader: true,
        // })
        const csvString = CSV.convertJSONToCSV(tableItems)

        CSV.exportCSV(csvString, `${page}.csv`)
    })

    btnImport.addEventListener('click', function onExportClick() {
        csvImportModal.classList.remove('ishidden')
    })

    uploadedFileInput.addEventListener('change', function () {
        if (uploadedFileInput.files.length > 0) {
            fileToUpload = uploadedFileInput.files[0]
            updateImportModal()
        }
    })

    btnUploadFile.addEventListener('click', function () {
        if (!window.FileReader) {
            alert('A FileReader objektum nem támogatott ebben a böngészőben')
            return
        }

        CSV.getJSONfromCSV(fileToUpload)
        resetImportModal()
        csvImportModal.classList.add('ishidden')
    })

    uploadDropzone.addEventListener('drop', function (e) {
        e.preventDefault()
        uploadDropzone.classList.remove('dragover')

        fileToUpload = e.dataTransfer.files[0]
        updateImportModal()
    })

    uploadDropzone.addEventListener('dragenter', function (e) {
        e.preventDefault()
    })

    uploadDropzone.addEventListener('dragover', function (e) {
        e.preventDefault()
        uploadDropzone.classList.add('dragover')
        return false
    })

    uploadDropzone.addEventListener('dragleave', function () {
        uploadDropzone.classList.remove('dragover')
        return false
    })

    modalCloseBtn.addEventListener('click', function () {
        csvImportModal.classList.add('ishidden')
        resetImportModal()
    })
})()
