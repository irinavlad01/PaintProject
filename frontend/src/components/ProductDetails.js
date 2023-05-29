import React from 'react';
import {useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../services/API';
import ProductUpdate from './ProductUpdate';

function ProductDetails() {
    const {id} = useParams()
    const [product, setProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    useEffect( () => {
        API.getProductById(id)
        .then(data => {
            console.log(data.produs)
            setProduct(data.produs)
        })
    }, [id]);

    useEffect(() => {
      const token = localStorage.getItem('token');
        if (token) {
            const tokenPayload = token.split('.')[1];
            const decodedToken = atob(tokenPayload);
            const userId = JSON.parse(decodedToken).id;

            API.getUserById(userId)
            .then(data => {setUser(data.user); console.log(data.user)})
            .catch(error => {
                if(error.response && error.response.status === 404){
                    console.log("Utilizatorul nu exista!");
                }
            })
        }
        else{
            console.log("Nu sunteti autentificat/ă!");
        }
    }, [])

    const addToCart = () => {
      API.addToCart(id).then(data => console.log(data))
      .catch(error => {
        if (error.response && error.response.status === 401){
          navigate("/login", {state: { message: "Trebuie sa fii autentificat/a pentru a adauga in cos articole!"}})
      }});
    }

    const editProduct = (product) => {
      setEditedProduct(product);
    }

    const deleteProduct = () =>{
      API.deleteProduct(product.id)
      .then(resp => console.log(resp));
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

          {user && user.admin ? (
            <>
              <button className="btn btn-primary" onClick={ () => editProduct(product)}>Actualizează</button>
              {editedProduct ? <ProductUpdate product = {editedProduct}/> : null}
              <button className="btn btn-danger" onClick={() => deleteProduct()}>Șterge</button>
            </>
            )
            : null
          }
        </div>
      ) : (<p>Produsul nu a fost gasit!</p>)
    }
    </>
  )
}

export default ProductDetails
