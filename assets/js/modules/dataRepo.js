// module to handle tables on the page

export const dataRepo = (function () {
    let teacherList = []
    let classRoomList = []

    const getTanarok = async () => {
        const response = await fetch('/data/tanarok.json')
        teacherList = await response.json()
        return teacherList
    }

    const getTermek = async () => {
        const response = await fetch('/data/termek.json')
        classRoomList = await response.json()
        return classRoomList
    }

    const getSzakok = async () => {
        const response = await fetch('/data/szakok.json')
        classRoomList = await response.json()
        return classRoomList
    }

    const getTargyak = async () => {
        const response = await fetch('/data/targyak.json')
        classRoomList = await response.json()
        return classRoomList
    }

    const getOrarend = async () => {
        const response = await fetch('/data/orak.json')
        classRoomList = await response.json()
        return classRoomList
    }

    // Return the public methods and properties
    return {
        getTanarok: getTanarok,
        getTermek: getTermek,
        getSzakok: getSzakok,
        getTargyak: getTargyak,
        getOrarend: getOrarend,
    }
})()
