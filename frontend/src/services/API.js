import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
const token = localStorage.getItem('token');

const API = {
    getAllProducts(){
        return axios.get(`${BASE_URL}/products`, {
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    },

    getProductById(id) {
        return axios.get(`${BASE_URL}/products/${id}`, {
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    register(userData){
        return axios.post(`${BASE_URL}/users/add`, userData, {
            headers:{
                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.data)
    },

    login(username, password){
        return axios.get(`${BASE_URL}/login`, {
            auth: {
                username: username, 
                password: password
            }
        })
        .then(response => response.data)
    }, 

    addToCart(id, productOptions){
        return axios.post(`${BASE_URL}/cart/add_product/${id}`, productOptions, {
            headers: {
                'Content-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
    }, 

    deleteFromCart(id){
        return axios.delete(`${BASE_URL}/cart/delete_product/${id}`, {
            headers: {
                'Content-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
    },

    cartProducts(){
        return axios.get(`${BASE_URL}/cart/products`, {
            headers: {
                'Content-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
    }, 

    placeOrder(address){
        return axios.post(`${BASE_URL}/order/create`, address, {
            headers: {
                'Content-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
    }, 

    getUserById(id){
        return axios.get(`${BASE_URL}/users/${id}`, {
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.data)
    },

    showAllOrders(){
        return axios.get(`${BASE_URL}/orders/show`, {
            headers: {
                'Content-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
    }, 

    showOrdersForUser(id){
        return axios.get(`${BASE_URL}/orders/show/${id}`, {
            headers: {
                'Content-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    },

    updateProduct(id, productData){
        return axios.put(`${BASE_URL}/products/${id}`, productData, {
            headers: {
                'Content-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    deleteProduct(id){
        return axios.delete(`${BASE_URL}/products/${id}`, {
            headers: {
                'Content-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    addProduct(productData){
        return axios.post(`${BASE_URL}/products/create`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    },

    productStocks(id){
        return axios.get(`${BASE_URL}/products/stock/${id}`, {
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    getAllUsers(){
        return axios.get(`${BASE_URL}/users`, {
            headers: {
                'Content-Type' : 'application/json', 
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    updateOrder(id, statusData){
        return axios.put(`${BASE_URL}/order/update/${id}`, statusData, {
            headers: {
                'Content-Type' : 'application/json', 
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    deleteOrder(id){
        return axios.delete(`${BASE_URL}/order/delete/${id}`, {
            headers: {
                'Content-Type' : 'application/json', 
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    getProductImages(id){
        return axios.get(`${BASE_URL}/products/images/${id}`, {
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    updateStock(id, stockData){
        return axios.put(`${BASE_URL}/products/stock/${id}`, stockData, {
            headers:{
                'Content-Type' : 'application/json', 
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    addStock(id, stockData){
        return axios.post(`${BASE_URL}/products/stock/${id}`, stockData, {
            headers:{
                'Content-Type' : 'application/json', 
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }
}

export default API