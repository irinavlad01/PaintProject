import React from 'react';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/API';


function Register() {
    const [email, setEmail] = useState("");
    const [parola , setParola] = useState("");
    const [nume, setNume] = useState("");
    const [prenume, setPrenume] = useState("");
    const [adresaDomiciliu, setAdresaDomiciliu] = useState("");
    const [telefon, setTelefon] = useState("");
    const navigate = useNavigate();


    const registerHadler = (e) =>
    {
        e.preventDefault();
        const userData = {
            nume: nume, 
            prenume: prenume, 
            email: email, 
            parola: parola, 
            adresa_domiciliu: adresaDomiciliu, 
            telefon: telefon
            
        }
        API.register(userData)
        .then(resp => {
            console.log(resp);
            navigate('/login', { state: { message: 'Înregistrare reușită! Autentifică-te!' } });
        })
    }
  return (
    <div>
      <form onSubmit={registerHadler} className="mb-3">
        <label htmlFor="nume" type="text" className="form-label">Nume:</label>
        <input type="text" className="form-control" value={nume}
        onChange={ (e) => setNume(e.target.value)}></input>

        <label htmlFor="prenume" type="text" className="form-label">Prenume:</label>
        <input type="text" className="form-control" value={prenume}
        onChange={ (e) => setPrenume(e.target.value)}></input>

        <label htmlFor="adresa" type="text" className="form-label">Adresa:</label>
        <input type="text" className="form-control" value={adresaDomiciliu}
        onChange={ (e) => setAdresaDomiciliu(e.target.value)}></input>

        <label htmlFor="telefon" type="text" className="form-label">Telefon:</label>
        <input type="text" className="form-control" value={telefon}
        onChange={ (e) => setTelefon(e.target.value)} maxLength={10}></input>

        <label htmlFor="email" type="text" className="form-label">Email:</label>
        <input type="email" className="form-control" value={email}
        onChange={ (e) => setEmail(e.target.value)}></input>

        <label htmlFor="parola" type="text" className="form-label">Parola:</label>
        <input type="text" className="form-control" value={parola}
        onChange={ (e) => setParola(e.target.value)}></input>

        <button type="submit" className="btn btn-primary mt-3">Înregistrează-te</button>
      </form>
    </div>
  )
}

export default Register
