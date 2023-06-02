import React from 'react'
import { useState } from 'react'


function OrderDetails() {
  const [userAddressCheck, setUserAddressCheck] = useState(false);
  const [newAddressCheck, setNewAddressCheck] = useState(false);

  const handleUserAddress = () => {
    if (!userAddressCheck){
      setUserAddressCheck(true);
      //interogheaza pentru datele utilizatorului autentificat
    }else{
      setUserAddressCheck(false);
    }
  }

  const handleNewAddress = () => {
    if(!newAddressCheck){
      setNewAddressCheck(true);
      //formular
    }else{
      setNewAddressCheck(false);
    }
  }
  

  return (
    <div>
      <h2>Adresa de livrare</h2>
      <form>
        <label>
          <input type='checkbox' checked={userAddressCheck} onChange={handleUserAddress}/>
          Adresa de domiciliu
        </label>
        <label>
          <input type='checkbox' checked={newAddressCheck} onChange={handleNewAddress}/>
          Altă adresa de livrare
        </label>
      </form>
    </div>
  )
}

export default OrderDetails
