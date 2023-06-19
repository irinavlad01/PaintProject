import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import API from '../services/API'

function Login() {
    const [email, setEmail] = useState("");
    const [parola, setParola] = useState("");
    const [authError, setAuthError] = useState("");

    const location = useLocation();
    const message = location.state && location.state.message;

    const handleLogin = e =>{
        e.preventDefault()
        API.login(email, parola)
        .then(data => {
            localStorage.setItem('token', data.token);
            console.log(data.token);
            window.location.href = '/cont';
        })
        .catch(error => {
          if(error.response && error.response.status === 401){
            setAuthError(error.response.data);
          }
        })
    }

  return (
    <div>
      {message && <p className="alert alert-success" role="alert">{message}</p>}
      {authError && <p className="alert alert-danger" role="alert">{authError}</p>}
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email" className="form-label">Email:</label>
        <input id="email"
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="form-control"></input>
        <label htmlFor="parola" className="form-label">Parola:</label>
        <input id="parola"
        type="text"
        value={parola}
        onChange={e => setParola(e.target.value)}
        className="form-control"></input>
        <button type="submit" className="btn btn-success">Log in</button>
      </form>
    </div>
  )
}

export default Login
