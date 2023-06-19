import React from 'react';
import { useState, useEffect } from 'react';
import API from '../services/API';
import { useNavigate } from 'react-router-dom';


function OrderDetails() {
 
  const [user, setUser] = useState();
  // const [message, setMessage] = useState("");
  const [addressOption, setAddressOption] = useState('userAddress');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  // const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddressOptionChange = (e) => {
    setAddressOption(e.target.value);
  };

  const handleDeliveryAddressChange = (e) => {
    setDeliveryAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let address = '';

    if (addressOption === 'userAddress') {
      address = user.adresa_domiciliu;
    } else {
      address = deliveryAddress;
    }

    API.placeOrder({adresa_livrare : address})
      .then(data => {
        navigate('/produse', {state: {message: data.message}});
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
      if (token) {
          const tokenPayload = token.split('.')[1];
          const decodedToken = atob(tokenPayload);
          const userId = JSON.parse(decodedToken).id;

          API.getUserById(userId)
          .then(data => {setUser(data.user); console.log(data.user)})
          .catch(error => {
              if(error.response && error.response.status === 404){
                  console.log("Utilizatorul nu exista!");
              }
          })
      }
      else{
          console.log("Nu sunteti autentificat/ă!");
      }
  }, []);
 

  return (
    <div>
      <h1>Detalii Comanda</h1>
      {/* {message && <p>{message}</p>} */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              value="userAddress"
              checked={addressOption === 'userAddress'}
              onChange={handleAddressOptionChange}
            />
            Adresa domiciliu
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="deliveryAddress"
              checked={addressOption === 'deliveryAddress'}
              onChange={handleAddressOptionChange}
            />
            Adresa livrare
          </label>
        </div>
        {addressOption === 'deliveryAddress' && (
          <div>
            <label htmlFor="deliveryAddress">Introduceți adresa de livrare:</label>
            <input
              type="text"
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={handleDeliveryAddressChange}
            />
          </div>
        )}
        {user && addressOption === 'userAddress' && <p>{user.adresa_domiciliu}</p>}
        <button type="submit">Trimite comandă</button>
      </form>
      <p>Modalitatea de plata curenta este ramburs. Multumim de intelegere!</p>
    </div>
  )
}

export default OrderDetails
