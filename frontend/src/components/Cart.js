import React from 'react'
import {useState, useEffect} from 'react';
import API from '../services/API';


function Cart() {
    const[isAuth, setIsAuth] = useState(false);
    const[addedProducts, setAddedProducts] = useState([]);
    const[message, setMessage] = useState("");

  useEffect( () => {
    const token = localStorage.getItem('token')
    if(token){
      setIsAuth(true);
      API.cartProducts().then(data => {setAddedProducts(data.produse)})
      .catch(error => {
        if(error.response && error.response.message === 401){
          setIsAuth(false);
        }
      })
    }
  }, []);

  const handleOrder = () => {
    API.placeOrder().then(data => {
        setMessage(data.message)
    })
    .catch(error => {
      if(error.response && error.response.message === 401){
        setIsAuth(false);
      }}
    )
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
      {isAuth && (<button className="btn btn-primary" onClick={handleOrder}>Comandă acum!</button>)}
        </ul>
        {message &&<p className="alert alert-success w-25" role="alert">{message}</p>}
    </div>
  )
}

export default Cart
