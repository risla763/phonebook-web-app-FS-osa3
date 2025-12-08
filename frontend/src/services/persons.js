import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    console.log('URL', baseUrl)
    return axios.get(baseUrl).catch(error => {
        console.log('fail')
    })
}

const create = personObject => {
    console.log('uusi objecti', personObject)
    return axios.post(baseUrl, personObject)
}

const update = (id, personObject) => {
    console.log('uuteen sivuun', personObject, `${baseUrl}/${id}`)
    return axios
    .put(`${baseUrl}/${id}`,personObject)
    .then(updatedPersonObject => {
        updatedPersonObject.data
    })
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`).catch(error => {
        console.log('fail')
    })
}
export default { 
    getAll: getAll, 
    create: create, 
    update: update,
    delete: deletePerson
  }