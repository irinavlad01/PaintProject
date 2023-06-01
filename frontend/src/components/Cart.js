import React from 'react'
import {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import API from '../services/API';


function Cart() {
    const[isAuth, setIsAuth] = useState(false);
    const[addedProducts, setAddedProducts] = useState([]);
    const[message, setMessage] = useState("");

    //cand se adauga produs in cos, din product options
    const location = useLocation();
    const successMessage = location.state && location.state.message;

    //pentru a nu reincarca pagina dupa actualizarea datelor
    const [deletedProduct, setDeletedProduct] = useState(null);

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
  }, [deletedProduct]);

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

  const handleDelete = (id) =>{
      API.deleteFromCart(id)
      .then(data => {
        console.log(data.message);
        setDeletedProduct(id);
      })
      .catch(error => console.log(error));
  }

  return (
    <>
    {successMessage && <p className='alert alert-success w-25'>{successMessage}</p>}
    <ul>
      {isAuth ? (
        addedProducts && addedProducts.length > 0 ? (
        addedProducts.map((product, index) => {
        if(product.id !== deletedProduct){
          return (
            <li key={`${product.id}-${index}`}>
                <p>{product.nume}</p>
                <p>{product.descriere_comanda}</p>
                <p>{product.culoare}</p>
                <p>{product.marime}</p>
                <p>{product.pret}</p>
                <button onClick={() => handleDelete(product.id)} className='btn btn-danger'>Sterge artciol</button>
            </li>
        );
        } 
        else{ return null; }
          })) : (<p>Cosul este gol.</p>)) 
        : (<p>Trebuie să fiți autentificat pentru a vizualiza cosul.</p>)}
    </ul>
    {isAuth && addedProducts && addedProducts.length > 0 ? (<button className="btn btn-primary" onClick={handleOrder}>Comandă acum!</button>)
    : null}
    {message &&<p className="alert alert-success w-25" role="alert">{message}</p>}

    </>
  )
}

export default Cart
