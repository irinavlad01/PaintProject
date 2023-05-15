import React from 'react';
import {useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../services/API';

function ProductDetails() {
    const {id} = useParams()
    const [product, setProduct] = useState(null);
    
    useEffect( () => {
        API.getProductById(id)
        .then(data => {
            console.log(data.produs)
            setProduct(data.produs)
        })
    }, [id]);

    const addToCart = () => {
      API.addToCart(id).then(data => console.log(data))
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
          <button className="btn btn-success" onClick={addToCart}>Adaugă în coș</button>
        </div>
      ) : (<p>Produsul nu a fost gasit!</p>)
    }
    </>
  )
}

export default ProductDetails
