// module to handle csv import export on page

export const csvImportExport = (function () {
    // let table = undefined
    let rows = []

    const parceCell = (tableCell) => {
        let parsedValue = tableCell.toString()

        // Replace double quotes with two double quotes -- " -> ""
        parsedValue = parsedValue.replace(/"/g, `""`)

        // Enclose value in double quotes if value contains double quote, coma or newline
        if (/[",\n"]/.test(parsedValue)) {
            parsedValue = `"${parsedValue}"`
        }

        return parsedValue
    }

    const convertTableToCSV = (data) => {
        // table = data.table
        rows = Array.from(data.table.querySelectorAll('tbody tr'))

        const lines = []
        const numberOfColumns = getLongestRowLenght()

        for (const row of rows) {
            let line = ''

            for (let i = 0; i < numberOfColumns; i++) {
                if (row.children[i] !== undefined) {
                    line += parceCell(row.children[i].textContent)
                }

                if (i !== numberOfColumns - 1) {
                    line += ','
                }
            }

            lines.push(line)
        }

        return lines.join('\n')
    }

    const convertJSONToCSV = (jsonData) => {
        if (jsonData.length === 0) {
            return
        }
        const lines = []
        const headerRow = Object.keys(jsonData[0])
        const csvRow = headerRow.map((column) => parceCell(column))
        lines.push(csvRow.join(','))

        for (let row of jsonData) {
            console.log(Object.values(row))
            const csvRow = Object.values(row).map((column) => parceCell(column))
            lines.push(csvRow.join(','))
        }
        return lines.join('\n')
    }

    const exportCSV = (csvString, exportFileName = 'export.csv') => {
        const csvBlob = new Blob([csvString], {
            type: 'text/csv;charset=utf-8',
        })
        const blobUrl = URL.createObjectURL(csvBlob)
        const anchorElement = document.createElement('a')

        anchorElement.href = blobUrl
        anchorElement.download = exportFileName
        anchorElement.click()

        // free memory space
        // setTimeout needed because of bugs in chrome and edge
        setTimeout(function revokeBlobURL() {
            URL.revokeObjectURL(blobUrl)
        }, 200)
    }

    const getLongestRowLenght = () => {
        return rows.reduce(
            (len, row) =>
                row.childElementCount > len ? row.childElementCount : len,
            0,
        )
    }

    /* IMPORT */

    const getJSONfromCSV = (fileToRead) => {
        console.log('called')
        let fReader = new FileReader()

        fReader.readAsText(fileToRead)

        fReader.addEventListener('load', function (e) {
            console.log(e.target.result)
        })

        fReader.addEventListener('error', function (e) {
            console.log(e)
        })
    }

    // Return the public methods and properties
    return {
        convertTableToCSV: convertTableToCSV,
        exportCSV: exportCSV,
        getJSONfromCSV: getJSONfromCSV,
        convertJSONToCSV: convertJSONToCSV,
    }
})()
