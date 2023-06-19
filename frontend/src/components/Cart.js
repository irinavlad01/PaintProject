import React from 'react'
import {useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../services/API';


function Cart() {
    const[isAuth, setIsAuth] = useState(false);
    const[addedProducts, setAddedProducts] = useState([]);

    const location = useLocation();
    const successMessage = location.state && location.state.message;

    const [deletedProduct, setDeletedProduct] = useState(null);


    const calculateTotalPrice = () => {
      const total = addedProducts.reduce((accumulator, product) => accumulator + product.pret, 0);
      return total;
    };

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
    <h1>Coșul de cumpărături</h1>
    <ul>
      {isAuth ? (
        addedProducts && addedProducts.length > 0 ? (
        addedProducts.map((product, index) => {
        if(product.id !== deletedProduct){
          return (
            <li key={`${product.id}-${index}`} className="list-element">
                <p>Produs: {product.nume}</p>
                <p>Descriere model: {product.descriere_comanda}</p>
                <p>Culoare: {product.culoare}</p>
                <p>Mărime: {product.marime}</p>
                <p>Preț: {product.pret}</p>
                <button onClick={() => handleDelete(product.id_adaugare)} className='btn btn-danger'>Sterge artciol</button>
            </li>
        );
        } 
        else{ return null; }
          })) : (<p>Cosul este gol.</p>)) 
        : (<p>Trebuie să fiți autentificat pentru a vizualiza cosul.</p>)}
    </ul>
    {isAuth && addedProducts && addedProducts.length > 0 ? (
      <div>
        <p>Total: {calculateTotalPrice()}</p>
         <button className="btn btn-primary"><Link to="/comanda" className="custom-link">Continua la finalizarea comenzii</Link></button>
      </div>
   ) 
    : null }

    </>
  )
}

export default Cart
