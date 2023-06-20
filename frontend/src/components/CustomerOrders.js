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
      const confirmDelete = window.confirm("Sunteți sigur/ă că doriți să anulați această comandă?")
      if(confirmDelete){
        API.deleteOrder(orderId)
        .then(resp => {
        console.log(resp);
        window.location.href = '/gestiune';
     });
      }
    }

  return (
    <div>
    {orders.map(orderGroup => (
      <div className="order-element" key={orderGroup.userId}>
        <div className="order-element-child">
        <h2>Utilizator: {orderGroup.userId}</h2>
        <p>Nume: {users.find(user => user.id === orderGroup.userId)?.nume} {users.find(user=>user.id === orderGroup.userId)?.prenume}</p>
        <p>Email: {users.find(user => user.id === orderGroup.userId)?.email}</p>
        </div>
        <div className="order-element-child">
        <h3>Comenzi:</h3>
        {orderGroup.orders.map(order => (
          <div className="user-order" key={order.id_comanda}>
            <h4>ID Comandă: {order.id_comanda}</h4>
            <p>ID Cos: {order.id_cos}</p>
            <p>Status: {order.status}</p>
            <p>Adresă de livrare: {order.adresa_livrare}</p>
            <h4>Produse comandate:</h4>
            <ul>
              {order.produse_comanda.map((produs, index) => (
                <li key={`${produs.id_produs}-${index}`}>
                  <h4>Nume produs: {produs.nume_produs}</h4>
                  <p>Preț: {produs.pret_produs}</p>
                  <p>Mărime: {produs.marime_produs}</p>
                  <p>Culoare: {produs.culoare_produs}</p>
                  <p>Descriere model: {produs.descriere_comanda}</p>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary" onClick={() => editOrder(order.id_comanda)}>Actualizare status</button>
            {editedOrderId === order.id_comanda ? <StatusUpdate orderId = {editedOrderId}/> : null}
            <button className="btn btn-danger" onClick={() => deleteOrder(order.id_comanda)}>Anulează comanda</button>
          </div>
        ))}
        </div>

      </div>
    ))}
  </div>
  )
}

export default CustomerOrders
