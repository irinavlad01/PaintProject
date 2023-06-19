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

    const [registerError, setRegisterError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [validEmail, setValidEmail] = useState(true);
    const [telefonError, setTelefonError] = useState("");
    const [validTelefon, setValidTelefon] = useState(true);
    const [validForm, setValidForm] = useState(true);

    const emailHandler = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

       if(!emailValue){
          setEmailError("Introduceți o adresă de email!");
          setValidEmail(false);
        }else{
          setEmailError("");
          setValidEmail(true);
        }

        const correctEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!correctEmail.test(emailValue)){
          setEmailError("Introduceți o adresă de email validă!");
          setValidEmail(false);
        }else{
          setEmailError("");
          setValidEmail(true);
        }

        if(validEmail && validTelefon){
          setValidForm(true);
        }
        else{
          setValidForm(false);
        }
    }

    const telefonHandler = (e) => {
      const telefonValue = e.target.value;
      setTelefon(telefonValue);
      if(telefonValue.length !== 10){
          setTelefonError("Numărul de telefon trebuie să conțină exact 10 caractere!");
          setValidTelefon(false);
        }else{
          setTelefonError("");
          setValidTelefon(true);
        }
      
      if(validEmail && validTelefon){
        setValidForm(true);
      }else{
        setValidForm(false);
      }
    }

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
        if(validEmail && validTelefon){
          setValidForm(true);
          API.register(userData)
        .then(resp => {
            console.log(resp);
            navigate('/login', { state: { message: 'Înregistrare reușită! Autentifică-te!' } });
        })
        .catch(error => {
          if(error.response && error.response.status === 409){
            setRegisterError(error.response.data);
          }
        })
        }else{
          setValidForm(false);
        }
    }
  return (
    <div>
      {registerError && <p className="alert alert-danger w-25" role="alert">{registerError}</p>}
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
        onChange={telefonHandler} maxLength={10}></input>
        {!validTelefon && <p className="alert alert-danger w-25" role="alert">{telefonError}</p>}

        <label htmlFor="email" type="text" className="form-label">Email:</label>
        <input type="email" className="form-control" value={email}
        onChange={emailHandler}></input>
        {!validEmail && <p className="alert alert-danger w-25" role="alert">{emailError}</p>}

        <label htmlFor="parola" type="text" className="form-label">Parola:</label>
        <input type="text" className="form-control" value={parola}
        onChange={ (e) => setParola(e.target.value)}></input>

        <button type="submit" className="btn btn-primary mt-3" disabled={!validForm}>Înregistrează-te</button>
      </form>
    </div>
  )
}

export default Register
