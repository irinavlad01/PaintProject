import React from 'react';
import {useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../services/API';
import ProductUpdate from './ProductUpdate';
import ProductOptions from './ProductOptions';
import StockUpdate from './StockUpdate';
import AddStock from './AddStock';

function ProductDetails() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);
    const [updatedStock, setUpdatedStock] = useState(null);
    const [addedStock, setAddedStock] = useState(null);
    const [user, setUser] = useState(null);
    const [productImages, setProductImages] = useState([]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [totalImages, setTotalImages] = useState(0);
    
    useEffect( () => {
        API.getProductById(id)
        .then(data => {
            console.log(data.produs);
            setProduct(data.produs);
        })
    }, [id]);

    useEffect(() => {
      API.getProductImages(id)
        .then((data) => {
          setProductImages(data.imagini);
          setTotalImages(data.imagini.length);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [id]);

    const handleNextImage = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === totalImages - 1 ? 0 : prevIndex + 1
      );
    };
    
    const handlePreviousImage = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? totalImages - 1 : prevIndex - 1
      );
    };
  

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

    const editProduct = (product) => {
      setEditedProduct(product);
    }

    const updateStock = (product) => {
      setUpdatedStock(product);
    }

    const addStock = (product) => {
      setAddedStock(product)
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
          <h1>{product.nume}</h1>
          <p>{product.descriere}</p>
          <p>Pret: {product.pret}</p>
          {productImages.length > 0 && (
            // <div>
            //   <ul>
            //     {productImages.map((image, index) => (
            //       <li key={index}>
            //         <div className='w-25'>
            //         <img src={`/${image.nume}`} alt={image.nume} className="img-thumbnail img-responsive" />
            //         </div>
            //       </li>
            //     ))}
            //   </ul>
            // </div>
            <div>
            <ul>
              <li>
                <div className="w-25 mx-auto">
                  <img
                    src={`/${productImages[currentImageIndex].nume}`}
                    alt={productImages[currentImageIndex].nume}
                    className="img-thumbnail img-responsive"
                  />
                </div>
              </li>
            </ul>
          </div>
          )}
          <button className="btn btn-primary" onClick={handlePreviousImage}>Înapoi</button>
          <button className="btn btn-primary" onClick={handleNextImage}>Înainte</button>
          {<ProductOptions id={id}/>}

          {user && user.admin ? (
            <>
              <button className="btn btn-primary" onClick={ () => editProduct(product)}>Editează</button>
              {editedProduct ? <ProductUpdate product = {editedProduct}/> : null}
              <button className="btn btn-danger" onClick={() => deleteProduct()}>Șterge</button>
              <button className="btn btn-warning" onClick={() => updateStock(product)}>Actualizeaza număr stoc</button>
              {updatedStock ? <StockUpdate product = {updatedStock}/> : null}
              <button className="btn btn-warning" onClick={() => addStock(product)}>Adaugă opțiuni și stoc</button>
              {addedStock ? <AddStock product = {addedStock}/> : null}
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
