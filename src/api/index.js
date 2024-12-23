import axios from "axios";

export const BASE_URL = 'http://localhost:5149/'

export const ENDPOINTS = {
    participant: 'Participant',
    question: 'question',
    getAnswers: 'Question/GetAnswers'
}

export const createAPIEndpoint = endpoint => {
    let url = BASE_URL + 'api/' + endpoint + '/'

    return {
        fetch: () => axios.get(url),
        fetchById: id => axios.get(url + id),
        post: newRecord => axios.post(url, newRecord),
        put: (id, updateRecord) => axios.put(url + id, updateRecord),
        delete: id => axios.delete(url + id)
    }
}