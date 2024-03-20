import axios from './axios'

const AddTypeProductService = (data) => {
    return axios.post('/api/add-type-product', data)
}

const getAllTypeProduct = () => {
    return axios.get('/api/get-all-type-product')
}

const deleteTypeProduct = (data) => {
    return axios.delete('/api/delete-type-product-by-id', {
        data: data
    })
}

const updateTypeProduct = (data) => {
    return axios.put('/api/update-type-produt-by-id', data)
}

const AddTrademarkService = (data) => {
    return axios.post('/api/add-trademark', data)
}

const getTrademarkService = () => {
    return axios.get('/api/get-all-trademark')
}

const deleteTrademarkById = (data) => {
    return axios.delete('/api/delete-trademark-by-id', {
        data: data
    })
}

export {
    AddTypeProductService,
    getAllTypeProduct,
    deleteTypeProduct,
    updateTypeProduct,
    AddTrademarkService,
    getTrademarkService,
    deleteTrademarkById
}