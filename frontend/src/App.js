import './App.css';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Login from './components/Login';
import Cart from './components/Cart';
import Home from './components/Home';
import {Link, Route, Routes} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Account from './components/Account';
import Orders from './components/Orders';
import Register from './components/Register';
import OrderDetails from './components/OrderDetails';
import CustomerOrders from './components/CustomerOrders';
import API from './services/API';

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [admin, setAdmin] = useState(false);

  useEffect( () => {
    const token = localStorage.getItem('token');
    if(token){
      setIsAuth(true);

      const tokenPayload = token.split('.')[1];
      const decodedToken = atob(tokenPayload);
      const userId = JSON.parse(decodedToken).id;
      
      API.getUserById(userId)
          .then(data => {setAdmin(data.user.admin); console.log(data.user.admin)})
          .catch(error => {
              if(error.response && error.response.status === 404){
                  console.log("Utilizatorul nu exista!");
              }
          })
      }
      else{
          console.log("Nu sunteti autentificat/ă!");
      }
      
      console.log(token) //pentru testare doar
    }, []);


  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Acasă</Link></li>
          <li><Link to="/produse">Produse</Link></li>
          {
            isAuth ? (<li><Link to="/cont">Bine ai revenit!</Link></li>)
            :
            (
              <li><Link to="/cont">Intra in cont</Link></li>
            )
          }
          <li><Link to="/cos">Coșul tău</Link></li>
          {
            admin && (<li><Link to="/gestiune">Gestiune comenzi</Link></li>)
          }
        </ul>
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/produse" element={<ProductList/>}></Route>
          <Route path ="/produse/:id" element={<ProductDetails/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/cos" element={<Cart/>}></Route>
          <Route path="/cont" element={<Account/>}></Route>
          <Route path="/comenzi" element={<Orders/>}></Route>
          <Route path="/inregistrare" element={<Register/>}></Route>
          <Route path="/comanda" element={<OrderDetails/>}></Route>
          <Route path="/gestiune" element={<CustomerOrders/>}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
