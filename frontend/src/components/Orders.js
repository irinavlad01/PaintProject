import React, { useEffect, useState } from 'react'
import API from '../services/API';


function Orders() {
    const [orders, setOrders] = useState([]);
    
    useEffect( () => {
        API.showAllOrders().then(data => setOrders(data.comenzi));
    }, []);

  return (
    <div>
        {orders.length > 0 ? (
            <ul>
            {orders.map(order => {
                return(
                <div key={order.id_comanda}>
                    <h3>Comanda cu numarul {order.id_comanda}</h3>
                    <h4>Statusul comenzii: <span className="text text-success">{order.status}</span></h4>
                    <ul>
                    {order.produse_comanda.map(product => {
                        return (
                            <li key={product.id_produs}>
                                <p>Nume produs: {product.nume_produs}</p>
                                <p>Pret produs: {product.pret_produs}</p>
                                <p>Detalii design comandat: {product.descriere_comanda}</p>
                            </li>
                        )
                    })}
                    </ul>
    
                    
                </div>
                )
            })}
          </ul>
        )
    : (<p>Plaseaza o comanda iar ea va fi afisata aici!</p>)}
      
    </div>
  )
}

export default Orders
