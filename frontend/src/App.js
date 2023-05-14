import './App.css';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import {Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/products" element={<ProductList/>}/>
        <Route path ="/products/:id" element={<ProductDetails/>}/>
      </Routes>
    </div>
  );
}

export default App;
