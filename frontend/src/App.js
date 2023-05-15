import './App.css';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Login from './components/Login';
import Cart from './components/Cart';
import {Link, Route, Routes} from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {

  const[isAuth, setIsAuth] = useState(false)

  useEffect( () => {
    const token = localStorage.getItem('token')
    if(token){
      setIsAuth(true);
    } 

    console.log(token) //pentru testare doar
  }, []);

  const handleLogout = () =>{
    localStorage.removeItem('token');
    window.location.href = '/produse';
  }

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Acasă</Link></li>
          <li><Link to="/produse">Produse</Link></li>
          {
            isAuth ? (<li><button onClick={handleLogout}>Log out</button></li>)
            :
            (
              <li><Link to="/login"><button>Log in</button></Link></li>
            )
          }
          <li><Link to="/cos">Coșul tău</Link></li>
        </ul>
      </nav>
      <div>
        <Routes>
          <Route path="/produse" element={<ProductList/>}/>
          <Route path ="/produse/:id" element={<ProductDetails/>}/>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/cos" element={<Cart/>}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
