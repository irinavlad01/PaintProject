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

    getProductById(id){ 
        return axios.get(`${BASE_URL}/products/${id}`, {
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    login(username, password){
        return axios.get(`${BASE_URL}/login`, {
            // headers: {
            //     'Content-Type' : 'application/json'
            // },
            auth: {
                username: username, 
                password: password
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    addToCart(id){
        return axios.post(`${BASE_URL}/cart/add_product/${id}`, null, {
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
                'Conent-Type' : 'application/json', 
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    placeOrder(){
        return axios.post(`${BASE_URL}/order/create`, null, {
            headers: {
                'Conent-Type' : 'application/json', 
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    getUserById(id){
        return axios.get(`${BASE_URL}/users/${id}`, {
            headers: {
                'Conent-Type' : 'application/json'
            }
        })
        .then(response => response.data)
    },

    showAllOrders(){
        return axios.get(`${BASE_URL}/orders/show`, {
            headers: {
                'Conent-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
        .catch(error => console.log(error))
    }, 

    updateProduct(id, productData){
        return axios.put(`${BASE_URL}/products/${id}`, productData, {
            headers: {
                'Conent-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
    }, 

    deleteProduct(id){
        return axios.delete(`${BASE_URL}/products/${id}`, {
            headers: {
                'Conent-Type' : 'application/json',
                'x-access-token' : `${token}`
            }
        })
        .then(response => response.data)
    }
}

export default API