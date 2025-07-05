import React, { useState } from 'react';
import API from '../services/API';
import { useNavigate } from 'react-router-dom';

function NewProduct() {
  const [nume, setNume] = useState("");
  const [categorie, setCategorie] = useState("");
  const [pret, setPret] = useState("");
  const [descriere, setDescriere] = useState("");
  const [fisier, setFisier] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nume", nume);
    formData.append("categorie", categorie);
    formData.append("pret", pret);
    formData.append("descriere", descriere);
    if (fisier) {
      formData.append("fisier", fisier);
    }

    API.addProduct(formData)
    .then(resp => {
      console.log(resp);
      navigate('/', { state: { message: 'Produs adăugat cu succes!' } });
    })
    .catch(err => {
      console.error("Eroare la trimiterea produsului:", err);
    });
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

          <label className="form-label">Fisier: </label>
          <input
            type="file"
            className="form-control"
            accept=".jpg,.jpeg"
            onChange={(e) => setFisier(e.target.files[0])}
          />
          <button type="submit" className="btn btn-success">Adaugă produs</button>
        </form>
    </div>
  )
}

export default NewProduct
