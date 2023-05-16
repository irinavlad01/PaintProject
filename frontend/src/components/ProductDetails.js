import React from 'react';
import {useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../services/API';

function ProductDetails() {
    const {id} = useParams()
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    
    useEffect( () => {
        API.getProductById(id)
        .then(data => {
            console.log(data.produs)
            setProduct(data.produs)
        })
    }, [id]);

    const addToCart = () => {
      API.addToCart(id).then(data => console.log(data))
      .catch(error => {
        if (error.response && error.response.status === 401){
          navigate("/login", {state: { message: "Trebuie sa fii autentificat/a pentru a adauga in cos articole!"}})
      }});
    }

  return (
    <>
    {
      product ? (
        <div>
          <h1>Product Details</h1>
          <p>Name: {product.nume}</p>
          <p>Description: {product.descriere}</p>
          <p>Price: {product.pret}</p>
          {product.stoc ? (<button className="btn btn-success" onClick={addToCart}>Adaugă în coș</button>)
          : (<div className="alert alert-danger w-25" role="alert">Produs indisponibil</div>)}
        </div>
      ) : (<p>Produsul nu a fost gasit!</p>)
    }
    </>
  )
}

export default ProductDetails
