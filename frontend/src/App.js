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

function App() {
  const[isAuth, setIsAuth] = useState(false)

  useEffect( () => {
    const token = localStorage.getItem('token')
    if(token){
      setIsAuth(true);
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
        </Routes>
      </div>
    </>
  );
}

export default App;
