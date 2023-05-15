import React from 'react'
import {useState, useEffect} from 'react';
// import {useParams} from 'react-router-dom';
import API from '../services/API';


function Cart() {
    const[isAuth, setIsAuth] = useState(false)
    const[addedProducts, setAddedProducts] = useState([])
    const[message, setMessage] = useState("")
    // const {id} = useParams()

  useEffect( () => {
    const token = localStorage.getItem('token')
    if(token){
      setIsAuth(true);
      API.cartProducts().then(data => setAddedProducts(data.produse))
    } 
  }, []);

  const handleOrder = () => {
    API.placeOrder().then(data => {
        setMessage(data.message)
    })
  }

  return (
    <div>
        <ul>
        {isAuth ? (addedProducts.map(product => (
            <li key={product.id}>
                <p>{product.nume}</p>
                <p>{product.categorie}</p>
                <p>{product.pret}</p>
            </li>
      )))
      : (<p>Trebuie sa fiti autentificat pentru a vizualiza cosul</p>)}
      {isAuth ? (<button className="btn btn-primary" onClick={handleOrder}>Comandă acum!</button>)
      : null}
        </ul>
        {message &&<p>{message}</p>}
    </div>
  )
}

export default Cart
