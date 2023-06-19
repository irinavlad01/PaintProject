import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Login from './components/Login';
import Cart from './components/Cart';
import {Link, Route, Routes} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Account from './components/Account';
import Orders from './components/Orders';
import Register from './components/Register';
import OrderDetails from './components/OrderDetails';
import CustomerOrders from './components/CustomerOrders';
import API from './services/API';
import NewProduct from './components/NewProduct';

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
                  console.log("Utilizatorul nu exista!");}
          })
      }
      else{
          console.log("Nu sunteti autentificat/ă!");
          setIsAuth(false);
      }
      
      console.log(token) //pentru testare doar
    }, []);

  return (
    <div>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav">
          {/* <li className="nav-item">
            <Link to="/" className="nav-link">Acasă</Link>
          </li> */}
          <li className="nav-item">
            <Link to="/" className="nav-link">Produse</Link>
          </li>
          {
            isAuth ? (
              <li className="nav-item">
                <Link to="/cont" className="nav-link">Bine ai revenit!</Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/cont" className="nav-link">Intra în cont</Link>
              </li>
            )
          }
          <li className="nav-item">
            <Link to="/cos" className="nav-link">Coșul tău</Link>
          </li>
          {
            admin && (
              <li className="nav-item">
                <Link to="/gestiune" className="nav-link">Gestiune comenzi</Link>
              </li>
            )
          }
        </ul>
      </nav>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProductList/>}></Route>
          <Route path ="/produse/:id" element={<ProductDetails/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/cos" element={<Cart/>}></Route>
          <Route path="/cont" element={<Account/>}></Route>
          <Route path="/comenzi" element={<Orders/>}></Route>
          <Route path="/inregistrare" element={<Register/>}></Route>
          <Route path="/comanda" element={<OrderDetails/>}></Route>
          <Route path="/gestiune" element={<CustomerOrders/>}></Route>
          <Route path="/produse/adauga" element={<NewProduct/>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
