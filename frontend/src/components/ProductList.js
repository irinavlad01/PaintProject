import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import API from '../services/API';
import { useLocation } from 'react-router-dom';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [sortAsc, setSortAsc] = useState(true);

    const location = useLocation();
    const successMessage = location.state && location.state.message;

    useEffect( () => {
        API.getAllProducts().then(data => {
            console.log(data.produse)
            setProducts(data.produse)

            const uniqueCategories = [...new Set(data.produse.map(product => product.categorie))];
            setCategories(uniqueCategories);
        })
    }, []);

    useEffect( () => {
      const updatedProducts = selectedCategory
            ? products.filter(product => product.categorie === selectedCategory)
            : products;

            // setFilteredProducts(updatedProducts);

      const sortedProducts = sortAsc
      ? [...updatedProducts].sort((a, b) => {
          return new Date(b.data_lansare) - new Date(a.data_lansare);
        })
      : updatedProducts;
      
      setFilteredProducts(sortedProducts);

    }, [selectedCategory, products, sortAsc]);

    const handleCategoryChange = e => setSelectedCategory(e.target.value);

    const handleSort = () => {
      setSortAsc(!sortAsc);
    };

    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
          if (token) {
              const tokenPayload = token.split('.')[1];
              const decodedToken = atob(tokenPayload);
              const userId = JSON.parse(decodedToken).id;
  
              API.getUserById(userId)
              .then(data => {setUser(data.user); console.log(data.user)})
              .catch(error => {
                  if(error.response && error.response.status === 404){
                      console.log("Utilizatorul nu exista!");
                  }
              })
          }
          else{
              console.log("Nu sunteti autentificat/ă!");
          }
      }, [])


  return (
    <div> 
      <h1>Welcome to PaintProject</h1>
      {successMessage && (<p className='alert alert-success' role='alert'>{successMessage}</p>)}
      {/* <button><Link to={`/products/create`}>Add product</Link></button> */}
      {user && user.admin && <button className="btn btn-primary"><Link to="/produse/adauga" className="custom-link">Adaugă produs</Link></button>}
      <button onClick={handleSort} className="btn btn-primary">
        {sortAsc ? 'Primele adaugari': 'Cele mai recente' }
      </button>
      <select value={selectedCategory} onChange={handleCategoryChange} className="form-control">
      <option value="">Toate categoriile</option>
      {categories.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
      {filteredProducts.map(product => (
        <div key={product.id}><Link to={`/produse/${product.id}`}>{product.nume}</Link>
        </div>
      ))}
      
    </div>
  )
}

export default ProductList
