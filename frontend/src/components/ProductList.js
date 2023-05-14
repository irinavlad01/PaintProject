import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import API from '../services/API';

function ProductList() {
    const [products, setProducts] = useState([])

    useEffect( () => {
        API.getAllProducts().then(data => {
            console.log(data.produse)
            setProducts(data.produse)
        })
    }, []);

  return (
    <div> 
      <h1>Lista produse</h1>
      {/* <button><Link to={`/products/create`}>Add product</Link></button> */}
      <ul>
        {products.map(product => {
          return(
            <li key = {product.id}>
              <h3><Link to={`/products/${product.id}`}>{product.nume}</Link></h3>
            </li>
          )
        })}
      </ul>
      
    </div>
  )
}

export default ProductList
