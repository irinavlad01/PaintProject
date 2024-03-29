import React from 'react'
import { useState } from 'react';
import API from '../services/API';

function ProductUpdate(props) {
    const [nume, setNume] = useState(props.product.nume);
    const [categorie, setCategorie] = useState(props.product.categorie);
    const [pret, setPret] = useState(props.product.pret);
    const [descriere, setDescriere] = useState(props.product.descriere);

    const updateProduct = (e) =>{
        e.preventDefault()
        const productData = {
          nume: nume,
          categorie: categorie, 
          pret: pret,
          descriere: descriere
        }

        API.updateProduct(props.product.id, productData)
        .then(resp => {console.log(resp); window.location.reload();});
    }

  return (
    <div>
      {props.product ? (
      
        <form onSubmit={updateProduct} className="mb-3">
            <label htmlFor="nume" type="text" className="form-label">Denumire:</label>
            <input type="text" className="form-control" value={nume} 
            onChange = {(e) => setNume(e.target.value)}/>

            <label htmlFor="categorie" type="text" className="form-label">Categorie:</label>
            <input type="text" className="form-control" value={categorie}
            onChange = {(e) => setCategorie(e.target.value)}/>

            <label htmlFor="pret" type="text" className="form-label">Pret:</label>
            <input type="text" className="form-control" value={pret}
            onChange = {(e) => setPret(e.target.value)}/>

            <label htmlFor="descriere" type="text" className="form-label">Descriere</label>
            <input type="text" className="form-control" value={descriere}
            onChange = {(e) => setDescriere(e.target.value)}/>

            <button type="submit" className="btn btn-success mt-3">Actualizează</button>
        </form>
      ) : null}
    </div>
  )
}

export default ProductUpdate
