// module to handle tables on the page

export const tableHandler = (function () {
    let table,
        tableHeaderRow,
        tableBody = undefined

    let editForm = undefined
    let tableHeaderLabels
    let itemList = []
    let IDColumnNumber = -1
    let fieldNames = []
    let editFormLabels = []
    let selectedItem, selectedItemID

    const getTeachers = () => itemList

    // public method to initialize the module fields
    const init = (initData) => {
        table = initData.table
        tableHeaderLabels = initData.tableHeaderLabels
        tableHeaderRow = table.querySelector('thead tr')
        tableBody = table.querySelector('tbody')
        itemList = initData.items
        editForm = initData.editForm
        IDColumnNumber = initData.IDColumnNumber || 0
        fieldNames = Object.keys(initData.editFormFields) || []
        editFormLabels = Object.values(initData.editFormFields) || []

        createTableHeaders()
        populateTable()
        createEditForm()
    }

    const createTableHeaders = () => {
        if (tableHeaderLabels) {
            tableHeaderLabels.forEach((label) => {
                const header = document.createElement('th')
                header.innerHTML = label
                tableHeaderRow.appendChild(header)
            })
        }
    }

    // private method to create a row in the table
    const createNewTableRow = (element) => {
        const newRow = document.createElement('tr')
        const idCol = document.createElement('td')
        idCol.innerHTML = element.id
        newRow.appendChild(idCol)

        fieldNames.forEach((fieldName) => {
            const newCol = document.createElement('td')
            newCol.innerHTML = element[`${fieldName}`]
            newRow.appendChild(newCol)
        })

        newRow.addEventListener('click', function (e) {
            let rowClickedOn = e.currentTarget

            if (rowClickedOn.classList.contains('selected')) {
                rowClickedOn.classList.remove('selected')
                updateEditForm()
                return
            }

            const selectedRow = rowClickedOn.parentElement.querySelector(
                'tr.selected',
            )
            if (selectedRow) {
                selectedRow.classList.remove('selected')
            }

            e.currentTarget.classList.add('selected')

            selectedItemID =
                rowClickedOn.children[IDColumnNumber].textContent - 0
            selectedItem = itemList.filter(
                (item) => item.id === selectedItemID,
            )[0]
            updateEditForm(selectedItem)
        })

        return newRow
    }

    const createEditForm = () => {
        for (let i = 0; i < fieldNames.length; i++) {
            const containerDiv = document.createElement('div')
            containerDiv.classList.add('editform__inputfield')

            const inputText = document.createElement('input')
            inputText.type = editFormLabels[i].type
            inputText.name = fieldNames[i]
            if (inputText.type !== 'checkbox') {
                inputText.required = true
            } else {
                inputText.addEventListener(
                    'click',
                    function handleCheckboxClick(e) {
                        e.currentTarget.value = e.currentTarget.checked
                            ? '1'
                            : '0'
                    },
                )
            }
            inputText.disabled = true

            const fieldLabel = document.createElement('label')
            fieldLabel.innerHTML = editFormLabels[i].label

            const underlineSpan = document.createElement('span')

            containerDiv.appendChild(inputText)
            containerDiv.appendChild(fieldLabel)
            containerDiv.appendChild(underlineSpan)

            editForm.appendChild(containerDiv)
        }

        const submitButton = document.createElement('input')
        submitButton.classList.add('table-btn')
        submitButton.type = 'submit'
        submitButton.value = 'Mentés'
        submitButton.disabled = true

        editForm.appendChild(submitButton)
    }

    const updateEditForm = (item) => {
        if (item) {
            fieldNames.forEach((fieldName, index) => {
                const field = editForm.querySelector(
                    `input[name='${fieldName}']`,
                )
                field.value = item[`${fieldName}`]
                field.disabled = false
                editForm.querySelector(`input[type='submit']`).disabled = false
                if (editFormLabels[index].type === 'checkbox') {
                    field.checked = field.value === '1'
                }
            })
        } else {
            fieldNames.forEach((fieldName) => {
                editForm.querySelector(`input[name='${fieldName}']`).value = ''
                editForm.querySelector(
                    `input[name='${fieldName}']`,
                ).checked = false
                editForm.querySelector(
                    `input[name='${fieldName}']`,
                ).disabled = true
                editForm.querySelector(`input[type='submit']`).disabled = true
            })
        }
    }

    /**
     * Function to return the ID of the selected item
     */
    const getSelectedItemID = () => selectedItemID || 0

    /**
     * Function to return the selected item
     */
    const getSelectedItem = () => selectedItem || 0

    // private method to populate the table
    const populateTable = () => {
        for (const item of itemList) {
            const newTableRow = createNewTableRow(item)
            tableBody.appendChild(newTableRow)
        }
    }

    /**
     * function to validate edit form
     */

    const validateEditForm = () => {
        for (const [index, fieldName] of fieldNames.entries()) {
            const field = editForm.querySelector(`input[name='${fieldName}']`)
            if (!field.validity.valid) {
                return {
                    valid: false,
                    invalidFieldLabel: editFormLabels[index].label,
                }
            }
        }

        return {
            valid: true,
        }
    }

    /**
     * Function to return the editform fieldvalues
     */
    const getEditFormValues = () => {
        const returnValue = new Object()
        returnValue.id = selectedItemID
        for (const fieldName of fieldNames) {
            returnValue[`${fieldName}`] = editForm.querySelector(
                `input[name='${fieldName}']`,
            ).value
        }

        return returnValue
    }

    // Return the public methods and properties
    return {
        getTeachers: getTeachers,
        init: init,
        getSelectedID: getSelectedItemID,
        getSelectedItem: getSelectedItem,
        validateEditForm: validateEditForm,
        getEditFormValues: getEditFormValues,
    }
})()
