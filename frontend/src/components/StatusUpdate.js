import React from 'react';
import { useState } from 'react';
import API from '../services/API';

function StatusUpdate(props) {
  const [status, setStatus] = useState('');

  const updateStatus = (e) =>{
    e.preventDefault();

    const statusData ={
      status: status
    }

    API.updateOrder(props.orderId, statusData)
    .then(resp => {console.log(resp); window.location.href = '/gestiune';});
  }
    
  return (
    <div>
      <form onSubmit={updateStatus}>
        <label>Status nou pentru comanda {props.orderId}: </label>
        <input type="text" value={status} onChange={(e) => setStatus(e.target.value )} className="form-control"/>
        <button className="btn btn-success" type="submit">Trimite</button>
      </form>
    </div>
  )
}

export default StatusUpdate
