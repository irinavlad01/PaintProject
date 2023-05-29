import React from 'react'
import { useState } from 'react';
import API from '../services/API';

function ProductUpdate(props) {
    const [nume, setNume] = useState(props.product.nume);

    const updateProduct = (e) =>{
        e.preventDefault()
        API.updateProduct(props.product.id, {nume})
        .then(resp => console.log(resp));
    }

  return (
    <div>
      {props.product ? (
      
        <form onSubmit={updateProduct} className="mb-3">
            <label htmlFor="nume" type="text" className="form-label">Editeaza numele produsului {props.product.nume}</label>
            <input type="text" className="form-control" value={nume} placeholder="Enter name"
            onChange = {(e) => setNume(e.target.value)}/>
            <button type="submit" className="btn btn-success mt-3">Update</button>
        </form>
      ) : null}
    </div>
  )
}

export default ProductUpdate
