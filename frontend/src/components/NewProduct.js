import React, { useState } from 'react';
import API from '../services/API';
import { useNavigate } from 'react-router-dom';

function NewProduct() {
  const [nume, setNume] = useState("");
  const [categorie, setCategorie] = useState("");
  const [pret, setPret] = useState("");
  const [descriere, setDescriere] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      nume: nume,
      categorie: categorie, 
      pret: pret,
      descriere: descriere
    }

    API.addProduct(productData)
    .then(resp => {
      console.log(resp);
      navigate('/produse', { state: { message: 'Produs adăugat cu succes!' } });
    })
  }


  return (
    <div>
        <form onSubmit={handleSubmit}>
          <label className="form-label">Nume: </label>
          <input type="text"
          className="form-control"
          value={nume}
          onChange={(e) => setNume(e.target.value)}></input>

          <label className="form-label">Categorie: </label>
          <input type="text"
          className="form-control"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}></input>

          <label className="form-label">Pret: </label>
          <input type="text"
          className="form-control"
          value={pret}
          onChange={(e) => setPret(e.target.value)}></input>

          <label className="form-label">Descriere: </label>
          <textarea type="text"
          className="form-control"
          value={descriere}
          onChange={(e) => setDescriere(e.target.value)}></textarea>

          <button type="submit" className="btn btn-success">Adaugă produs</button>
        </form>
    </div>
  )
}

export default NewProduct
