import React, { useEffect, useState } from 'react';
import API from '../services/API';
import StatusUpdate from './StatusUpdate';

function CustomerOrders() {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [editedOrderId, setEditedOrderId] = useState(false);

    useEffect( () =>{
        API.getAllUsers()
        .then(data => {
            setUsers(data.users);

            const ordersPromises = data.users.map( user => {
              return API.showOrdersForUser(user.id)
              .then(data => ({userId: user.id, orders: data.comenzi}))
              .catch(error => {
                console.log(error);
                return ({userId: user.id, orders: []});
              })
            })

            Promise.all(ordersPromises)
            .then(ordersData => {
              setOrders(ordersData);
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
        // API.showOrdersForUser().then(data => setOrders(data.comenzi));
    }, []);

    const editOrder = (orderId) =>{
      if(editedOrderId === orderId){
        setEditedOrderId(null);
      }else{
        setEditedOrderId(orderId);
        console.log('Editeaza status');
      }
    }

    const deleteOrder = (orderId) => {
      API.deleteOrder(orderId)
      .then(resp => console.log(resp));
    }


  return (
    <div>
    {orders.map(orderGroup => (
      <div key={orderGroup.userId}>
        <h2>Utilizator: {orderGroup.userId}</h2>
        <p>Nume: {users.find(user => user.id === orderGroup.userId)?.nume} {users.find(user=>user.id === orderGroup.userId)?.prenume}</p>
        <p>Email: {users.find(user => user.id === orderGroup.userId)?.email}</p>
        <h3>Comenzi:</h3>
        {orderGroup.orders.map(order => (
          <div key={order.id_comanda}>
            <p>ID Comandă: {order.id_comanda}</p>
            <p>ID Cos: {order.id_cos}</p>
            <p>Status: {order.status}</p>
            <button className="btn btn-primary" onClick={() => editOrder(order.id_comanda)}>Actualizare status</button>
            {editedOrderId === order.id_comanda ? <StatusUpdate orderId = {editedOrderId}/> : null}
            <button className="btn btn-danger" onClick={() => deleteOrder(order.id_comanda)}>Anulează comanda</button>
            <p>Produse comandate:</p>
            <ul>
              {order.produse_comanda.map((produs, index) => (
                <li key={`${produs.id_produs}-${index}`}>
                  Nume produs: {produs.nume_produs}, Preț: {produs.pret_produs}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ))}
  </div>
  )
}

export default CustomerOrders
