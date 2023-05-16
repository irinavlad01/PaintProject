import React, { useEffect, useState } from 'react'
import API from '../services/API'
import Login from './Login'
import Orders from './Orders';

function Account() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [loginForm, setLoginForm] = useState(false);
    const [orderList, setOrderList] = useState(false);

    useEffect( () => {
        const token = localStorage.getItem('token');
        if (token) {
            const tokenPayload = token.split('.')[1];
            const decodedToken = atob(tokenPayload);
            const userId = JSON.parse(decodedToken).id;

            API.getUserById(userId)
            .then(data => {setUser(data.user)})
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
        if(!loginForm){
            setLoginForm(true);
        }else{
            setLoginForm(false)
        }
    }

    const handleLogout = () =>{
        localStorage.removeItem('token');
        window.location.href = '/cont';
      }

    const showOrders = () => {
      if(!orderList){
        setOrderList(true);
      }else{
        setOrderList(false);
      }
    }

  return (
    <>
      {message ? (<div>
        <p>{message}</p>
        <button className="btn btn-primary" onClick={showLoginForm}>Log in</button>
        {loginForm && <Login/>}
      </div>) 
      : ( user && 
      <div>
        <h3>Bun venit, {user.nume} {user.prenume}!</h3>
        <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
        <h3 onClick={showOrders}>Istoric comenzi</h3>
        {orderList && <Orders/>}
      </div>)}
    </>
  )
}

export default Account
