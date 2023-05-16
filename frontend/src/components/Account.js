import React, { useEffect, useState } from 'react'
import API from '../services/API'
import Login from './Login'

function Account() {
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState("")
    const [loginForm, setLoginForm] = useState(false)

    useEffect( () => {
        const token = localStorage.getItem('token');
        if (token) {
            const tokenPayload = token.split('.')[1];
            const decodedToken = atob(tokenPayload);
            const userId = JSON.parse(decodedToken).id;

            API.getUserById(userId)
            .then(data => setUser(data.user))
            .catch(error => {
                if(error.response && error.response.status === 404){
                    setMessage("Utilizatorul nu a fost gasit sau nu exista!");
                }
            })
        }
        else{
            setMessage("Nu sunteți autentificat/ă!");
        }
    }, []);

    const showLoginForm = () => {
        if(loginForm === false){
            setLoginForm(true);
        }else{
            setLoginForm(false)
        }
    }

    const handleLogout = () =>{
        localStorage.removeItem('token');
        window.location.href = '/cont';
      }


  return (
    <>
      {message ? (<div>
        <p>{message}</p>
        <button className="btn btn-primary" onClick={showLoginForm}>Log in</button>
        {loginForm && <Login/>}
      </div>) 
      : ( user && <div>
        <p>Bun venit, {user.nume} {user.prenume}!</p>
        <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
      </div>)}
    </>
  )
}

export default Account
