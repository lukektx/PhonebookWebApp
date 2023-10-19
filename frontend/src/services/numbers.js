import axios from 'axios'

const baseURL = '/api/persons'

const getall = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const get = (id) => {
    const request = axios.get(`${baseURL}/${id}`)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then(response => response.data)
}

const update = (id, newValue) => {
    const request = axios.put(`${baseURL}/${id}`, newValue)
    return request.then(response => response.data)
}

const create = (value) => {
    const request = axios.post(baseURL, value)
    return request.then(response => response.data)
}

export default { getall, get, remove, update, create }